#!/bin/bash

for theme in 'alizarin' 'amethyst' 'black' 'blue' 'carrot' 'chambray' 'default' 'green' 'green_sea' 'nephritis' 'peter_river' 'pink' 'ripe_lemon' 'wet_asphalt'
do
        sass scss/$theme.scss themes/$theme.css;
done