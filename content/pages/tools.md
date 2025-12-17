+++
title="tools"
path="tools"
+++
starting with my OS, i used to run [ubuntu](https://ubuntu.com/) when i first learned how to program. i’ve always liked to play around with the desktop environment and customize everything until it looks exactly as i want it to. i also enjoyed giving new life to my old computers by installing a lightweight, fast operating system (especially compared to windows).

after a while, however, i started to feel the need to run the latest versions of different programs, so i tried some _rolling release distributions_. that’s how i ran into [arch linux](https://archlinux.org/). at the time, the [archinstall script](https://wiki.archlinux.org/title/Archinstall) didn’t exist, so installing it manually sparked my interest in how operating systems actually work and how they are built.

currently, i’m still running arch mainly because of the _rolling release updates_, the [aur](https://wiki.archlinux.org/title/Arch_User_Repository), and the flexibility arch gives me to tailor every element of my OS exactly the way i want through [theming and ricing](https://jie-fang.github.io/blog/basics-of-ricing).

{{ figure(src="/img/setup.png", caption="my current setup running arch + hyprland + swaync") }}

if you’re curious about the programs i use, or you want to replicate this setup, my [dotfiles](https://github.com/SashaBerkowsky/.dotfiles) are public. i also wrote a small setup script so it should only take a few seconds to be up and running.

that said, i’ve never personally run into any of the common issues people on the internet usually complain about _arch_. honestly, the day i do, i’ll probably follow [linus torvalds](https://es.wikipedia.org/wiki/Linus_Torvalds) and jump ship to [fedora](https://www.fedoraproject.org/es/)

# programs

my personal criteria when choosing the tools that i use for work (and other things in life) tend to go hand in hand with the [unix philosophy](http://www.catb.org/~esr/writings/taoup/html/ch01s06.html). to put it in a few words, these are design principles for software to be:

- programs that do one thing and do it well
- programs designed to work together
- programs that handle text streams

also, as i said previously, i’m very meticulous and thorough with my everyday tools (be it software, hardware, or anything in between) so anything i use on a regular basis has to be reliable, snappy and perfectly tailored in order to cover my needs to the best of its ability. this is why, when using software, i always start with a barebones setup and gradually build a configuration of my own by adding blocks of customization one after the other.

because of this i’ll always avoid "bloated" programs with big pre-made configurations. they might be handy and useful for newcomers, but i often find myself constrained and fighting the software instead of making the most of it.

> by making your own custom configurations for simple, straightforward software you get to know and use your tools to their fullest and the freedom to fix and tweak them to your liking at your own pace

all of this reasoning culminates in my dev environment being sustained by: 

- [neovim](https://neovim.io/) as my text editor of choice for its ease of use, infinite customizability, reliability, and [vim motions](https://vimdoc.sourceforge.net/htmldoc/motion.html)
- [kitty](https://sw.kovidgoyal.net/kitty/) for my terminal as it’s really performant, well documented, simple and modular
- [tmux](https://github.com/tmux/tmux/wiki/Getting-Started) for handling sessions and multiple terminals

all of this supported by small scripts of my own on the side.

<b>tldr;</b> i hate using the mouse, love simple open source software and making it my own.

on a side note, as i really value the responsiveness that text-based user interfaces give me, i’ll admit that anytime i’m doing something risky or scary on a computer it’s always reassuring to be able to do it in a GUI.
