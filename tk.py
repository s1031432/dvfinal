import tkinter as tk
import random
window=tk.Tk()
window.title("window")
window.geometry("600x600")
wincount = {"player":0, "npc":0, "tie":0}
## 1 -> display, 0 -> hidden
game_stat_display_flag = 0
## render hint text label
La_1=tk.Label(window,text="Rock:0 Paper:1 Scissors:2", anchor='w', justify= "left")
La_1.place(x=200,y=100)
## render output text label
La_2=tk.Label(window,text="Hi", anchor='w', justify= "left", font=('Helvetica 14'))
La_2.place(x=200,y=225)
## render count text label
La_3=tk.Label(window,text="", anchor='w', justify="left")
La_3.place(x=200,y=325)
## when button click

def button_event_left():
    global wincount, game_stat_display_flag
    options = ["Rock", "Paper", "Scissors"]
    var = en_1.get()
    ## input error
    if len(var) < 1 or int(var) < 0 or int(var) > 2:
        La_2["text"] = "Input error!"
    else:
        ## computer 0~2
        com = random.randint(0,2)
        ## who win who lose
        if options[int(var)-1] == options[com]:
            wincount["player"] += 1
            winner = "Win"
        elif options[com-1] == options[int(var)]:
            wincount["npc"] += 1
            winner = "Lose"
        else:
            wincount["tie"] += 1
            winner = "Tie"
        ## result output ( win or lose )
        La_2["text"] = "Player: {}\nNPC: {}\n\n{}".format(options[int(var)], options[com], winner)
        ## update stat
        game_stat()

def button_event_right():
    global game_stat_display_flag, wincount
    ## press button -> flag +1
    game_stat_display_flag += 1
    game_stat()

def game_stat():
    global game_stat_display_flag, wincount
    if game_stat_display_flag % 2:
        ## display
        bu_2["text"] = "hidden"
        La_3["text"] = "Total: {}\nPlayer win: {}\nNPC win: {}\nTie: {}".format(wincount["player"]+wincount["npc"]+wincount["tie"], wincount["player"], wincount["npc"], wincount["tie"])
    else:
        ## hidden
        bu_2["text"] = "display"
        La_3["text"] = ""

## render input
en_1=tk.Entry(window)
en_1.place(x=200,y=150)
## render button
bu_1=tk.Button(window,text="clickme",command=button_event_left)
bu_1.place(x=200,y=180)

bu_2=tk.Button(window,text="display",command=button_event_right)
bu_2.place(x=300,y=180)

window.mainloop()