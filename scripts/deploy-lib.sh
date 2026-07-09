# Общие помощники для deploy/switch/check. Подключается через: . scripts/deploy-lib.sh
# Требует .env с USER и SERVER.

. ./.env

remote() {
	ssh -o BatchMode=yes "${USER}@${SERVER}" "$@"
}

# Активная версия = куда указывают доменные симлинки в ~/www.
# Если симлинки указывают и на v1, и на v2 одновременно — состояние смешанное, работать нельзя.
detect_active() {
	targets=$(remote 'find ~/www -maxdepth 1 -type l -exec readlink {} \;' | grep -E '^qr/v[12]$' | sort -u)
	count=$(echo "$targets" | grep -c 'qr/v')
	if [ "$count" -ne 1 ]; then
		echo "ОШИБКА: симлинки в смешанном состоянии (указывают на: $(echo $targets | tr '\n' ' ')). Разберитесь вручную." >&2
		exit 1
	fi
	echo "$targets" | sed 's#qr/##'
}

other_version() {
	if [ "$1" = "v1" ]; then echo "v2"; else echo "v1"; fi
}

show_versions() {
	remote 'for d in ~/www/qr/v1 ~/www/qr/v1/inc ~/www/qr/v2 ~/www/qr/v2/inc; do echo "$d: $(git -C $d log --oneline -1)"; done'
}
