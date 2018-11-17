<script language="javascript" type="text/javascript" src="/LanguageBar.js"></script>
<!-- # michaelx-corner -->
# Adb failed to extract native libraries

### Apk Installation Failed
  Have you ever run into a problem on your Android phone like this.
```
  × App not installed.
```
  Your phone won't install the apk you've just downloaded and you demand an explanation which is nowhere to be found.
  This might happened a lot if you're a fan for sideloads and your phone is out-dated. Because along with new versions of Android and APIs issued every year by Google, new apps or updated ones may have a higher minimum system API level requirement. This requirement then stops you from using the apps.
  This requirement can be easily found in AndroidManifest.xml.
```xml
  <uses-sdk android:minSdkVersion="28"
            android:targetSdkVersion="28" />
```
  Many may know that none of these "for-new-phone" apps can be installed on old system platform, but few understand why it would also happen in some other situations. The first one is when there is a flaw in a customized or rooted ROMs, and somehow files belonging to that app weren't deleted completely during last unintallation, a re-install will prompt this. The other situation, however, 

### 'adb install'
Adb: Failure [INSTALL_FAILED_INVALID_APK: Failed to extract native libraries, res=-2]
