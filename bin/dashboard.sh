if [ ! $SAHI_HOME ] 
then
	export SAHI_HOME=..
fi
if [ ! $SAHI_USERDATA_DIR ]
then
	export SAHI_USERDATA_DIR_TMP=$SAHI_HOME/userdata
else	
	export SAHI_USERDATA_DIR_TMP=$SAHI_USERDATA_DIR
fi	
java -version
export POI_JARS=$SAHI_HOME/extlib/poi/excelpoi.jar:$SAHI_HOME/extlib/poi/dom4j-1.6.1.jar:$SAHI_HOME/extlib/poi/poi-3.7-20101029.jar:$SAHI_HOME/extlib/poi/poi-ooxml-3.7-20101029.jar:$SAHI_HOME/extlib/poi/poi-ooxml-schemas-3.7-20101029.jar:$SAHI_HOME/extlib/poi/xmlbeans-2.3.0.jar
export JAVAX_MAIL_JARS=$SAHI_HOME/extlib/mail/mail.jar:$SAHI_HOME/extlib/mail/activation.jar
export C3P0_JARS=$SAHI_HOME/extlib/c3p0/c3p0-0.9.5-pre5.jar:$SAHI_HOME/extlib/c3p0/mchange-commons-java-0.2.6.2.jar
export APPLET_JARS=$SAHI_HOME/extlib/javassist/javassist.jar:$SAHI_HOME/extlib/sahi/sahiapplet.jar
SAHI_CLASS_PATH=$SAHI_HOME/lib/sahi.jar:$SAHI_HOME/extlib/rhino/js.jar:$SAHI_HOME/extlib/apc/commons-codec-1.3.jar:$SAHI_HOME/extlib/db/h2.jar:$SAHI_HOME/extlib/license/truelicense.jar:$SAHI_HOME/extlib/license/truexml.jar:$POI_JARS:$JAVAX_MAIL_JARS:$C3P0_JARS:$APPLET_JARS

java -Djsse.enableSNIExtension=false -Djava.util.logging.config.file=$SAHI_USERDATA_DIR_TMP/config/log.properties -classpath $SAHI_EXT_CLASS_PATH:$SAHI_CLASS_PATH net.sf.sahi.ui.Dashboard "$SAHI_HOME" "$SAHI_USERDATA_DIR_TMP"
