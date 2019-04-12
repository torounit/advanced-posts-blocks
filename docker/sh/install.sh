#!/bin/bash
set -x
#
# Variables
#
WP_VERSION="latest"
WP_THEME="twentynineteen"
WP_PORT=${1-80}
WP_ADMIN_USER="admin"
WP_ADMIN_PASS="admin"
WP_LOCALE="en_US"
WP_DEBUG=false
WP_THEME_UNIT_TEST=false
WP_THEME_UNIT_TEST_URL="https://raw.githubusercontent.com/WPTRT/theme-unit-test/master/themeunittestdata.wordpress.xml"
WP_ALWAYS_REST_DB=false

ROOT=$(cd $(dirname $0);cd ../../;pwd)
ENV=${ROOT}/.env
# override variables.
eval "$(cat ${ENV} <(echo) <(declare -x))"
echo $ENV
echo $WP_LOCALE

sleep 10

if $(wp core is-installed); then
	if "${WP_ALWAYS_REST_DB}"; then
		wp db reset --yes
	fi
fi

#
# Install WordPress
#
if ! $(wp core is-installed); then

	if [[ ${WP_PORT} = 80 ]]; then
		wp core install --url="http://localhost" --title="WordPress" --admin_user="$WP_ADMIN_USER" --admin_password="$WP_ADMIN_PASS" --admin_email="admin@example.com" --path="/var/www/html"
	else
		wp core install --url="http://localhost:$WP_PORT" --title="WordPress" --admin_user="$WP_ADMIN_USER" --admin_password="$WP_ADMIN_PASS" --admin_email="admin@example.com" --path="/var/www/html"
	fi

	#
	# debug mode
	#
	if "${WP_DEBUG}"; then
		wp config set WP_DEBUG true --raw --type=constant
		wp config set JETPACK_DEV_DEBUG true --raw --type=constant
		wp config set SCRIPT_DEBUG true --raw --type=constant
	fi

	#
	# install importer
	#
	wp plugin install wordpress-importer --activate

	#
	#  import theme unit test
	#
	if "${WP_THEME_UNIT_TEST}"; then

		curl ${WP_THEME_UNIT_TEST_URL} -o /tmp/themeunittestdata.wordpress.xml
		wp import /tmp/themeunittestdata.wordpress.xml  --authors=create  --quiet
		wp option update posts_per_page 5
		wp option update page_comments 1
		wp option update comments_per_page 5
		wp option update show_on_front page
		wp option update page_on_front 701
		wp option update page_for_posts 703
	fi

	#
	# locale setting
	#
	if [[ ${WP_LOCALE} != "en_US" ]]; then
		wp language core install ${WP_LOCALE} --activate
		wp language plugin install --all ${WP_LOCALE}
		wp language theme install --all ${WP_LOCALE}
	fi

fi

