#!/bin/bash

for fichier in ls ../../$1/* ; do
	if [ -f $fichier ] ; then
		todel=`echo $fichier | sed 's:../../::g'`
		if [ -f $todel ] ; then
			echo $todel
			rm -f $todel
		fi
	fi
done
