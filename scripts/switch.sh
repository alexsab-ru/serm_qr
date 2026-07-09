#!/bin/sh
# Переключает все доменные симлинки ~/www/<domain> между qr/v1 и qr/v2, затем прогоняет проверку.
# Использование: pnpm switch [v1|v2]  (без аргумента — на неактивную версию)
# Откат: pnpm switch <прежняя версия>
set -e
. scripts/deploy-lib.sh

ACTIVE=$(detect_active)
TARGET=${1:-$(other_version "$ACTIVE")}

case "$TARGET" in
	v1|v2) ;;
	*) echo "ОШИБКА: цель должна быть v1 или v2, получено: $TARGET" >&2; exit 1 ;;
esac

if [ "$TARGET" = "$ACTIVE" ]; then
	echo "Версия $TARGET уже активна, переключение не требуется."
	exit 0
fi

echo "Переключаю симлинки: $ACTIVE -> $TARGET ..."
remote 'cd ~/www && find . -maxdepth 1 -type l | while read l; do
	case "$(readlink "$l")" in
		qr/v1|qr/v2) ln -sfn qr/'"$TARGET"' "$l" && echo "  $l -> qr/'"$TARGET"'";;
	esac
done'

echo
echo "Переключено. Запускаю проверку прода..."
if sh scripts/check.sh; then
	echo
	echo "Всё работает. Откат при необходимости: pnpm switch $ACTIVE"
else
	echo
	echo "ЕСТЬ ОШИБКИ! Быстрый откат: pnpm switch $ACTIVE"
	exit 1
fi
