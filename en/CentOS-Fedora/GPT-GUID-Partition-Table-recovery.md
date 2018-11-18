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
FAT32 | MSR | NTFS | NTFS | `    ` | `   ` | NTFS | NTFS | Idle  
ESP | MSR | C: | OEM Partition | `     ` | ` ` | E: | F: | Idle  

  Since my grub2, its configuration and other booting programs are saved in ESP(EFI system partition), I could still obtain some useful informations.
  
### GUID partition table structure
  According to this diagram on Wikipedia, the basic idea is to re-write entries in the pure Windows GPT.  
  ![GPT Partition Table Scheme](https://upload.wikimedia.org/wikipedia/commons/0/07/GUID_Partition_Table_Scheme.svg "GPT Partition Table Scheme")  
  The partition entry array has a more specified structure. From [this article]()
