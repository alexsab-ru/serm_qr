#!/bin/sh
# Деплой в НЕАКТИВНУЮ версию (blue-green): push репозиториев, rsync ассетов, git pull на сервере.
# Использование: pnpm upload [v1|v2]  (без аргумента — в неактивную; "deploy" занят самим pnpm)
# После деплоя переключение делается отдельно: pnpm switch
set -e
. scripts/deploy-lib.sh

ACTIVE=$(detect_active)
TARGET=${1:-$(other_version "$ACTIVE")}

case "$TARGET" in
	v1|v2) ;;
	*) echo "ОШИБКА: цель должна быть v1 или v2, получено: $TARGET" >&2; exit 1 ;;
esac

echo "Активная версия: $ACTIVE"
if [ "$TARGET" = "$ACTIVE" ]; then
	echo "ВНИМАНИЕ: деплой в АКТИВНУЮ версию $TARGET — изменения попадут на прод сразу, без переключения!"
else
	echo "Деплой в неактивную версию: $TARGET"
fi

if [ -n "$(git status --porcelain)" ] || [ -n "$(git -C inc status --porcelain)" ]; then
	echo "ВНИМАНИЕ: есть незакоммиченные изменения — на сервер уедут только закоммиченные."
fi

echo "--- push репозиториев..."
git push origin master
git -C inc push origin master

echo "--- rsync ассетов в ~/www/qr/$TARGET ..."
rsync -a --delete ./assets "${USER}@${SERVER}:~/www/qr/$TARGET" | tail -2

echo "--- git pull на сервере ($TARGET)..."
remote "cd ~/www/qr/$TARGET && git pull && cd inc && git pull"

echo
echo "--- версии на сервере:"
show_versions
echo
if [ "$TARGET" != "$ACTIVE" ]; then
	echo "Готово. Переключить прод: pnpm switch   (откат обратно: pnpm switch $ACTIVE)"
else
	echo "Готово. Проверить прод: pnpm check"
fi
