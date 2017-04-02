Erstinstallation:

1. MongoDB Server installieren(https://www.mongodb.com/de)

2. MongoDB per Konsole starten 
	- dazu in MongoDB/server/x.x/bin navigieren (x.x entspricht der aktuelle installierten Mongo-version)
	- Befehl 'mongod'ausfuehren

3. In neuer Konsole: Mit mongorestore Daten importieren: 
	- Ordner C:/data/db erstellen
	- dazu in MongoDB/server/x.x/bin navigieren (x.x entspricht der aktuelle installierten Mongo-version)
	- Befehl 'mongorestore /db:questionDatabase /dir:<C:/PfadZumProjekt>/database' in mongo Verzeichnis ausfuehren

4. NodeJs installieren (https://nodejs.org/en/)

4. node js Server in einer neuen Konsole mit folgendem Befehl starten:
	- node server.js 

5. Die Webseite ist nun erreichbar unter localhost:8765/site

Starten des Projektes: 

1. MongoDB per Konsole starten 
	- dazu in MongoDB/server/x.x/bin navigieren (x.x entspricht der aktuelle installierten Mongo-version)
	- Befehl 'mongod'ausfuehren


2. node js Server in einer neuen Konsole mit folgendem Befehl starten:
	- node server.js 

3. Die Webseite ist nun erreichbar unter localhost:8765/site