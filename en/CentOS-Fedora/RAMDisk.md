<script language="javascript" type="text/javascript" src="/LanguageBar.js"></script>
<!-- # michaelx-corner -->
# \_michaelx\_ @ CornerStudio - Index

## What if I can turn my super big memory into a disk?
- A RAMDisk has a faster speed over SSD and can save much of the latter one's life.
- To create a RAMDisk in Fedora or CentOS, you can use a kernel module command "modprobe" with the module option "brd"(block ram disk). 
- Then you can find a new device /dev/ram0 appeared, which can be mounted as a disk later.
- Before this disk becomes readable, a file system is needed on it.
- Here comes the command "mkfs.ext4" or any others with a different file system type.

- The full script I use to create a RAMDisk with a 1.5G partition is listed below (all these require root privilege):
```
modprobe brd rd_size=1572864 max_part=1 rd_nr=1
mkfs.ext4 /dev/ram0
mkdir /ram
mount /dev/ram0 /ram
chmod 777 /ram
```

- And to unload this RAMDisk:
```
rm -rf /ram/*
umount /ram
rm -rf /ram
modprobe -r brd
```
- You can put these into two seperate .sh files for future use.
-----
> [Creating a RAM Disk | Support | SUSE]([https://www.suse.com/support/kb/doc/?id=7012396])
