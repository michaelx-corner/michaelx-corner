<script language="javascript" type="text/javascript" src="/LanguageBar.js"></script>
<!-- # michaelx-corner -->
# Adb failed to extract native libraries

### Apk Installation Failed
  Have you ever run into a problem on your Android phone like this.
```
  × App not installed.
```
   Your phone won't install the apk you've just downloaded and the explanation you demand is nowhere to be found.  
   This might happened a lot if you're a fan for sideloads and your phone is out-dated. Because along with new versions of Android and APIs issued every year by Google, new apps or updated ones may have a higher minimum system API level requirement. This then stops you from using the apks.  
   This requirement can be easily found in AndroidManifest.xml.  
```xml
  <uses-sdk android:minSdkVersion="28"
            android:targetSdkVersion="28" />
```
  Other possible reasons like signature or permission problem will not be discussed in this article.  
  Anyway, many may know that none of these "for-new-phone" apps can be installed on old system platforms, but few understand why it would also happen in some other special situations. First, when there is a flaw in a customized or rooted ROMs and somehow files belonging to that app weren't deleted completely during last unintallation, a re-install will cause prompting this. The other situation, however, is due to the apk file and its developer. This article focuses on the latter one.  

### 'adb install'
Adb: Failure [INSTALL_FAILED_INVALID_APK: Failed to extract native libraries, res=-2]
  If you try to look for a reason by `adb install`, you may get notified with this error message. Seemed weird to many people, it shows that there is something wrong with the `.so` files, i.e. libraries. The best part is that it actually can be fixed easily if you know what to check.  
```xml
  <application ...
               android:extractNativeLibs="false"
               ...>
```
  According to [this article](https://developer.android.google.cn/guide/topics/manifest/application-element#extractNativeLibs) from Android Developers site, this attribute, rare in common apks, has a specific requirement on the apk file itself.
> If set to false, then your native libraries must be page aligned and stored uncompressed in the APK. No code changes are required as the linker loads the libraries directly from the APK at runtime.
