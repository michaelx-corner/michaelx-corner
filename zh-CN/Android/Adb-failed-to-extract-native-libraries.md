<script language="javascript" type="text/javascript" src="/LanguageBar.js"></script>
<!-- # michaelx-corner -->
# Adb failed to extract native libraries


### 更新：2019年2月
  根据谷歌 Android Developers 网站 Zipalign 工具页面，
```
If you use apksigner, zipalign must only be performed before the APK file has been signed. If you sign your APK using apksigner and make further changes to the APK, its signature is invalidated.

If you use jarsigner, zipalign must only be performed after the APK file has been signed.
```
.
  这意味着除非你的 APK 只使用了`v1 scheme (JAR signing)`签名（多数较有历史的项目是这样，签名一旦颁布，很少会再进行更新），你才能使用下文的方法。我的情况的确如此，可以用[APK-Info](https://forum.xda-developers.com/android/general/apk-info-rebuild-t3614970)工具看出。
```
Verified using v1 scheme (JAR signing): true
Verified using v2 scheme (APK Signature Scheme v2): false
Number of signers: 1
```

### Apk安装失败
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
  
### Zipalign
  Let's check the alignment with zipalign tool which can be found in Android SDK tool set folder.
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
  Exactly, libraries weren't zipaligned properly in this apk. Without content and signature change, it can be repaired by zipalign tool.  
```
Verification FAILED
PS Z:\> C:\Programs\Android\android-sdk\build-tools\28.0.3\zipalign.exe -p -v 4 .\update_cache_4.1.5.apk .\com.meizu.mznfcpay-4.1.5.apk
Verifying alignment of .\com.meizu.mznfcpay-4.1.5.apk (4)...
...
 9773056 lib/armeabi/libAPSE_1.1.5.so (OK)
10649600 lib/armeabi/libcom_meizu_mznfcpay_security.so (OK)
10690560 lib/armeabi/libflybird.so (OK)
10973184 lib/armeabi/libmeizu_pay_jni.so (OK)
10997760 lib/armeabi/libofflinecrypto.so (OK)
11038720 lib/armeabi/libopenssl.so (OK)
12197888 lib/armeabi/libsgavmp.so (OK)
12283904 lib/armeabi/libsgmain.so (OK)
12685312 lib/armeabi/libsgsecuritybody.so (OK)
12804096 lib/armeabi/libuptsmaddon.so (OK)
...
Verification succesful
PS Z:\> adb install -r .\com.meizu.mznfcpay-4.1.5.apk
Success
```
  After zipalign, you can smoothly install or upgrade with this apk and scold the app developer.  

## 有用的链接:
  Zipalign用法:[Sign your app | Android Developers](https://developer.android.google.cn/studio/publish/app-signing)
