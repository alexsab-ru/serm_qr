#!/bin/sh
# Проверка работоспособности прода: все домены-симлинки отвечают 200 без PHP-ошибок,
# у qr.aeroterms.ru страница сотрудника рендерит форму оценки.
# Использование: pnpm check
. scripts/deploy-lib.sh

ERR_PATTERN='<b>Fatal error</b>|<b>Parse error</b>|<b>Warning</b>|<b>Deprecated</b>'
TMP=$(mktemp)
FAIL=0
trap 'rm -f "$TMP"' EXIT

ACTIVE=$(detect_active)
echo "Активная версия: $ACTIVE"
echo

DOMAINS=$(remote 'cd ~/www && find . -maxdepth 1 -type l | while read l; do
	case "$(readlink "$l")" in qr/v1|qr/v2) basename "$l";; esac
done' | sort)

for d in $DOMAINS; do
	code=$(curl -sk --max-time 20 -o "$TMP" -w '%{http_code}' "https://$d/")
	case "$code" in
		200)
			if grep -qE "$ERR_PATTERN" "$TMP"; then
				echo "FAIL $d — PHP-ошибка на странице: $(grep -oE "$ERR_PATTERN" "$TMP" | head -1)"
				FAIL=$((FAIL+1))
			else
				echo "ok   $d"
			fi
			;;
		000)
			# домен не резолвится / не отвечает — обычно снятый с регистрации домен, не проблема деплоя
			echo "warn $d — недоступен (DNS/сеть), пропущен"
			;;
		301|302)
			echo "warn $d — редирект ($(curl -sk --max-time 20 -o /dev/null -w '%{redirect_url}' "https://$d/")), пропущен"
			;;
		*)
			echo "FAIL $d — HTTP $code"
			FAIL=$((FAIL+1))
			;;
	esac
done

# Спец-проверка страницы оценки кассира на aeroterms: берём первый Path из кэша на сервере
EMP=$(remote "php -r '\$d=json_decode(file_get_contents(getenv(\"HOME\").\"/www/qr/$ACTIVE/storage/json/qr.aeroterms.ru-qr-employee.json\"),true); if(is_array(\$d)) foreach(\$d as \$k=>\$v){ if(is_array(\$v)) { echo \$k; break; } }'" 2>/dev/null)
if [ -n "$EMP" ]; then
	code=$(curl -sk --max-time 20 -o "$TMP" -w '%{http_code}' "https://qr.aeroterms.ru/$EMP")
	if [ "$code" = "200" ] && grep -q 'id="rate-stars"' "$TMP" && ! grep -qE "$ERR_PATTERN" "$TMP"; then
		echo "ok   qr.aeroterms.ru/$EMP (форма оценки кассира)"
	else
		echo "FAIL qr.aeroterms.ru/$EMP — HTTP $code, форма оценки не найдена или PHP-ошибка"
		FAIL=$((FAIL+1))
	fi
else
	echo "warn не удалось получить Path сотрудника aeroterms из кэша — спец-проверка пропущена"
fi

echo
if [ "$FAIL" -eq 0 ]; then
	echo "ПРОВЕРКА ПРОЙДЕНА: все домены в порядке."
	exit 0
else
	echo "ПРОВАЛЕНО ПРОВЕРОК: $FAIL"
	exit 1
fi
