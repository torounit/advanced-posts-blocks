#!/usr/bin/env bash
CONTAINER="cli"
docker-compose run --rm  -u root $CONTAINER chmod 767 /var/www/html/wp-content /var/www/html/wp-content/plugins /var/www/html/wp-config.php /var/www/html/wp-settings.php
docker-compose run --rm $CONTAINER bash /home/www-data/app/docker/sh/wait-for.sh mysql:3306 -t 120 -- bash /home/www-data/app/docker/sh/install.sh
