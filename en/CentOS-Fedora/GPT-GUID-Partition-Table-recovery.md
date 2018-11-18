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
10. Recover the partition table file `.ptf` with DiskGenius or other hex editors.
