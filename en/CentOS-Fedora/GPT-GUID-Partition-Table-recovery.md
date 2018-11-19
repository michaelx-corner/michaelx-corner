<script language="javascript" type="text/javascript" src="/LanguageBar.js"></script>
<!-- # michaelx-corner -->
# GPT/GUID Partition Table recovery
  This article is mainly about manual recovery of Ext4 and LVM2 GUID Partition **_table_**(GPT).  
### Partion lost
  Due to unintentionally deleting partitions in partition table and leaving the data content untouched, these partition can be recovered in some ways. In my case, Linux partitions unidentified by flawed software in Windows was deleted when modifying other Windows partitions. Luckly, since I remember what the original partition composition is like, the recovery software being expensive and actually not  compatible exactly, I decide to try recovering them myself.  
  
gpt1 | gpt2 | gpt3 | gpt4 | gpt5 | gpt6 | gpt7 | gpt8 | gpt9  
--- | --- | --- | ------ | --- | --- | --- | --- | ---  
FAT32 | MSR | NTFS | NTFS | Ext4 | LVM | NTFS | NTFS | Idle  
ESP | MSR | C: | OEM Partition | /boot | / | E: | F: | Idle  

  Turned into this now:  

gpt1 | gpt2 | gpt3 | gpt4 | gpt5 | gpt6 | gpt7 | gpt8 | gpt9  
--- | --- | --- | ------ | --- | --- | --- | --- | ---  
FAT32 | MSR | NTFS | NTFS | ` ` | ` ` | NTFS | NTFS | Idle  
ESP | MSR | C: | OEM Partition | ` ` | ` ` | E: | F: | Idle  

  Since my grub2, its configuration and other booting programs are saved in ESP(EFI system partition), I could still obtain some useful informations.
  
### GUID partition table structure and recovery work flow synopsis
  According to this diagram on Wikipedia, the basic idea is to re-write entries in the pure Windows GPT.  
  ![GPT Partition Table Scheme](https://upload.wikimedia.org/wikipedia/commons/0/07/GUID_Partition_Table_Scheme.svg "GPT Partition Table Scheme")  
  Use the free version of DiskGenius software, the backup version, not the exact arrangement on disk, of this GPT can be saved to a file. And with the HxD software and others alike, a peek and even direct modifications on disk can be done. The partition entry array has a more specified structure. From [this article on Wikipedia](https://en.wikipedia.org/wiki/GUID_Partition_Table#Partition_table_header_(LBA_1)), the work flow of this recovery is listed below.  
1. Obtain and back up the current GPT into a `.ptf` file.
2. Split the entry arrays into a standalone file (exact 32 x 512 bytes = 16,384 bytes).
3. Decide the original partition type GUIDs, Unique partition GUIDs and first and last LBA data and add these as new entries.
4. Calculate CRC32 of the entry array file.
5. Split the partition table header into a standalone file (exact 92 bytes).
6. Clear the original CRC32s at offset 0x10 and 0x58, copy the calculated one into 0x58 to 0x61.
7. Calculate CRC32 of the table header file.
8. copy the calculated one into 0x10 to 0x13.
9. Replace the the 92-byte table header block and 16384-byte entry array block with files made from last few steps.
10. Recover the partition table with `.ptf` file using DiskGenius or other hex editors.

### GUIDs and LBAs
  To add one new entry into entry array file, two GUIDs and two LBAs are needed. My first lost partition is a Linux Ext4 partition with a mount point `/boot`. In my last reboot, grub2 prompt that the partition specified by GUID in `grub.cfg` file cannot be found. The partition type GUID of Linux file system data is `0FC63DAF-8483-4772-8E79-3D69D8477DE4`. The unique partition GUID is ` 55AA9CBD-9128-442B-B16D-AFB3-94CF0BCB` which was generated during first formation and in my case recorded by grub. So the first 32 bytes of the Ext4 partition is  `AF 3D C6 0F 83 84 72 47 79 8E E4 7D 47 D8 69 3D`  `BD 9C AA 55 28 91 2B 44 6D B1 B3 AF CB 0B CF 94`. Note that big-endian order has to be used with these GUIDs.  
  
  The Ext4 partition starts with two empty padding sectors, i.e. 2x512bytes=1024bytes, then followed with Ext4 super block. This super block can be located by searching its unique GUID or the mount point string `/boot`. Thus the first LBA is the header offset divided by sector size, 0x200h bytes here. The ending offset can be calculated by adding partition size, blocks count multiply by blocks size, to the start offset. By dividing 0x200h and minus 1, the last LBA can be obtained. Each LBA takes up 16 bytes.  
  
  Similarly, entry of LVM2 can be define. The file system type GUID is `E6D6D379-F507-44C2-A23C-238F2A3DF928`. The unique GUID seemed not written into the file system. I regenerated a new GUID myself from online generator tool. LVM2 partition begins with a 4-sector padding, followed with LVM header called "label", `LABELONE`, then metadata area. From metadata, LVM partition size can be decided by `pe_count`, `extent_size` and sector size (also 512 bytes).  
  
  After all these seekings and calculations, GPT headers can be aquired. Save them to disk and reboot to test if it is successful.  
  
### Notes
* If LVM entry is not correct, Druct may prompt `device mapper cannot calculate initial queue limits`.  
* Wrong GPT saving will immediately cause a blue screen in Windows. So a backup GPT on USB drive and a bootable PE system on it are needed.  

## Useful links
GPT Backup: [GPT分区表的备份与恢复](https://www.douban.com/note/534777362/)
GPT Wiki: [GUID Partition Table - Wikipedia](https://en.wikipedia.org/wiki/GUID_Partition_Table)  
Ext4 Wiki: [Ext4 Disk Layout - Ext4](https://ext4.wiki.kernel.org/index.php/Ext4_Disk_Layout)  
LVM Metadata: [LVM元数据分析 - LastRitter的个人空间 - 开源中国](https://my.oschina.net/LastRitter/blog/875444)  
