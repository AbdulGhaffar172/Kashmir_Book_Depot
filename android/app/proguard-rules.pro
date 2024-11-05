# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:
# AdMob Proguard rules
-keep public class com.google.android.gms.ads.** { *; }
-keep public class com.google.android.gms.common.** { *; }
-keepclassmembers class * extends java.util.ListResourceBundle {
    protected Object[][] getContents();
}
-keep public class com.google.ads.** { *; }
-keep class com.google.android.gms.internal.* { *; }
-dontwarn com.google.android.gms.**
