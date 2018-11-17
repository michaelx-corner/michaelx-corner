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
  <uses-sdk android:minSdkVersion="24"
            android:targetSdkVersion="24" />
```
  Other possible reasons like signature or permission problem will not be discussed in this article.  
  
  Anyway, many may know that none of these "for-new-phone" apps can be installed on old system platforms, but few understand why it would also happen in some other special situations. First, when there is a flaw in a customized or rooted ROMs and somehow files belonging to that app weren't deleted completely during last unintallation, a re-install will cause prompting this. The other situation, however, is due to the apk file and its developer. This article focuses on the latter one.  

### 'adb install'
```
PS Z:\> adb install -r .\com.meizu.mznfcpay-4.1.5.apk
adb: failed to install .\com.meizu.mznfcpay-4.1.5.apk: 
  Failure [INSTALL_FAILED_INVALID_APK: Failed to extract native libraries, res=-2]
```
  If you try to look for a reason by `adb install`, you may get notified with this error message. Seemed weird to many people, it shows that there is something wrong with the `.so` files, i.e. libraries. The best part is that it actually can be fixed easily if you know what to check if you're not the developer of this app.  
```xml
  <application ...
               android:extractNativeLibs="false"
               ...>
```
  According to [this article](https://developer.android.google.cn/guide/topics/manifest/application-element#extractNativeLibs) from Android Developers site, this attribute, rare in common apks, has a specific requirement on the apk file itself.
> If set to false, then your native libraries must be page aligned and stored uncompressed in the APK. No code changes are required as the linker loads the libraries directly from the APK at runtime.
  Thus, this message means a high possiblity of 'unzipaligned' in the zip/apk file, or at least the library part makes the package manager unable to locate the `.so` files and copy them byte-by-byte into the file system.  
  
  Let's check the alignment.
```
PS Z:\> C:\Programs\Android\android-sdk\build-tools\28.0.3\zipalign.exe
Zip alignment utility
Copyright (C) 2009 The Android Open Source Project

Usage: zipalign [-f] [-p] [-v] [-z] <align> infile.zip outfile.zip
       zipalign -c [-p] [-v] <align> infile.zip

  <align>: alignment in bytes, e.g. '4' provides 32-bit alignment
  -c: check alignment only (does not modify file)
  -f: overwrite existing outfile.zip
  -p: memory page alignment for stored shared object files
  -v: verbose output
  -z: recompress using Zopfli
PS Z:\> C:\Programs\Android\android-sdk\build-tools\28.0.3\zipalign.exe -c -p -v 4 .\update_cache_4.1.5.apk
Verifying alignment of .\update_cache_4.1.5.apk (4)...
...
 9770085 lib/armeabi/libAPSE_1.1.5.so (BAD - 1)
10645292 lib/armeabi/libcom_meizu_mznfcpay_security.so (OK)
10683499 lib/armeabi/libflybird.so (BAD - 3)
10965568 lib/armeabi/libmeizu_pay_jni.so (OK)
10987433 lib/armeabi/libofflinecrypto.so (BAD - 1)
11025920 lib/armeabi/libopenssl.so (OK)
12183370 lib/armeabi/libsgavmp.so (BAD - 2)
12266390 lib/armeabi/libsgmain.so (BAD - 2)
12666446 lib/armeabi/libsgsecuritybody.so (BAD - 2)
12782864 lib/armeabi/libuptsmaddon.so (OK)
...
Verification FAILED
```
