<script language="javascript" type="text/javascript" src="/LanguageBar.js"></script>
<!-- # michaelx-corner -->
# GPT/GUID Partition Table recovery
  This article is mainly about manual recovery of Ext4 and LVM2 GUID Partition **_table_**.  
### Partion lost
  Due to unintentionally deleting partitions in partition table and leaving the data content untouched, these partition can be recovered in some ways. In my case, Linux partitions unidentified by flawed software in Windows was deleted when modifying other Windows partitions. Luckly, since I remember what the original partition composition is like, the recovery software being expensive and actually not  compatible exactly, I decide to try recovering them myself.  
gpt1 | gpt2 | gpt3 | gpt4 | gpt5 | gpt6 | gpt7 | gpt8 | gpt9  
--- | --- | --- | ------ | --- | --- | --- | --- | ---  
FAT32 | MSR | NTFS | NTFS | Ext4 | LVM | NTFS | NTFS | Idle  
ESP | MSR | C: | OEM Partition | /boot | / | E: | F: | Idle  
