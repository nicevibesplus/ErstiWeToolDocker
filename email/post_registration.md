Hallo {{ firstname }},

vielen Dank für deine Anmeldung zum Erstiwochenende {{ year }}!
Bitte lies dir diese E-Mail aufmerksam durch.
Sie enthält viele Informationen, die für einen reibungslosen Ablauf des Wochenendes wichtig sind.

Das Erstiwochenende findet vom {{ dateFormat dates.begin "dd DD[.] MMMM" }} bis {{ dateFormat dates.end "dd DD[.] MMMM" }} {{ year }} statt.
Wir fahren wieder in das [Tagungshaus Drübberholz](http://www.druebberholz.de/).

  - Hinfahrt: {{ dateFormat dates.begin "DD[.] MMMM [um] hh[:]mm [Uhr]" }} vom GEO1
  - Rückfahrt: {{ dateFormat dates.end "DD[.] MMMM [um] hh[:]mm [Uhr]" }} aus Drübberholz

Bitte denkt daran am Freitag genügend Proviant für die Busfahrt mitzunehmen! Wir werden erst um etwa 19 Uhr Abendessen. Für die Rückfahrt werdet ihr die Möglichkeit haben euch extra Brote vom Frühstück zu schmieren und auch etwas Obst zu stibitzen.

{{#if prev_user}}
**Hinweis:** Die Fahrt ist altersbeschränkt ab 18!
Wir werden das Alter der Teilnehmer am Morgen der Abfahrt zu kontrollieren, halte deinen Ausweis bereit!
{{/if}}

#### Packliste
  - **wichtig**: Bettzeug oder Schlafsack & Bettlaken
    (Wer sich Bettzeug vom Haus leiht, muss dieses direkt bezahlen)
  - **wichtig**: einen sehr persönlichen Gegenstand!
  - **wichtig**: Regenkleidung (warm & trocken)
  - **wichtig**: feste (Wander-)Schuhe (möglichst wasserdicht)
  - 2\. Paar trockene Schuhe
  - Handtuch
  - Brotdose + Wasserflasche
  - Ausweis
  - Ausreichend Proviant für Freitag Mittag und Nachmittag (es gibt erst etwa 19 Uhr wieder etwas)
  - Musik: CDs, MP3s, Gitarre oder andere Instrumente, Texte, sonstige Abspielgeräte
  - Hausschuhe (nicht brennbar!)
  - Kleingeld (für Bier, Saft, Wasser, etc.)
    (Sonstige Einkaufsmöglichkeiten quasi nicht vorhanden)
  - Schreibzeug
  - Gute Laune!

#### Abmeldung
Deine Anmeldung ist verbindlich.
Wenn du an der Fahrt nicht mehr teilnehmen willst/kannst,
ist die Rückerstattung des Teilnehmerbetrages nur möglich,
wenn ein Nachfolger gefunden wird (je nach Andrang auf der Warteliste).

Um dich abzumelden, besuche [geofs.de/erstiwe](https://geofs.uni-muenster.de/erstiwe/)
<<<<<<< HEAD
und gebe unter "Abmelden" deinen Token und deine Emailaddresse an.
=======
und gebe unter "Abmelden" deinen Code und deine Emailaddresse an.
>>>>>>> a019edd... Renamed Errors to be user-friendly.
Die Nachrücker auf der Warteliste werden informiert werden,
und bei der Registrierung deine Emailaddresse erhalten,
um den Teilnehmerbetrag an dich zu übertragen.

Folgend noch einmal die von dir angegebenen Daten:

|                     |                            |
|---------------------|----------------------------|
|           **Name:** | {{firstname}} {{lastname}} |
|           **Code:** | {{token}}                  |
|     **Geburtstag:** | {{birthday}}               |
|    **Studiengang:** | {{study}}                  |
| **Ernährungsstil:** | {{food}}                   |
|      **Kommentar:** | {{comment}}                |

Wenn du noch Fragen hast, schreib uns gerne eine E-Mail an [fsgi@uni-muenster.de](mailto:fsgi@uni-muenster.de?subject=Erstiwochenende {{year}}).

Viele Grüße,

deine Fachschaft Geoinformatik und Fachschaft Geographie/Landschaftsökologie
