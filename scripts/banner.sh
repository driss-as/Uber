#!/usr/bin/env bash
# Affiche de grands titres ASCII pour la présentation vidéo du projet.
# Usage : ./scripts/banner.sh "TEXTE"
# Sans argument, affiche le titre du projet.

TEXT="${1:-UBER CLONE}"
COLOR="${2:-cyan}"

if command -v toilet >/dev/null 2>&1; then
  toilet -f big -F border --gay "$TEXT" 2>/dev/null || toilet -f big "$TEXT"
else
  figlet -f block "$TEXT"
fi
