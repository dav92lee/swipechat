README
======
Fill this file in with information on your project, along with any known bugs.

Overview:
---------
To my knowledge, my implementation of the chatroom application meets all requirements for the app.
	- button to create chatroom (prevents making one that has messages already)
	- user can choose nickname
	- display messages that refresh at least every 5 seconds


Significant Design Choices:
---------------------------
1) Single Table: I initially made two tables and joined them by the room name parameter; however, due to a TA's suggestoin, I only used one "messages" table to complete this assignment.  Because the assignment was pretty straightforward, I didn't see the need of creating a new "rooms" table to simply determine if a room has already been created.  Instead, I simply looked in the messages table and searched if there were any messages created already in that table.  (There are clear privacy concerns with this implementation; however, the other implementation still does not solve the fact that anyone can read all messages sent on this application)
2) Username Creation Before Entering Chatroom: I asked the user to create a username prior to entering a chatroom, so it would hinder the easiest way for users to post with multiple usernames.
3) Messages are restricted to 250 characters: I restricted messages sent to be only 250 messages.  Messages longer than that will be cut to only the first 250 characters; however you can still submit longer messages than that.

Known Bugs:
-----------
None to my knowledge.

Chatroom Todo:
- little bugs: (5pm)
	x make username appear
	x make timestamp appear
	x make messages appear
x refresh messages periodically (6pm)
x ensure new room names do not clash (7pm)
x style chatroom (10pm)


Extra:
- join room
- refresh messages (but only que up the ones from the last 5 minutes)