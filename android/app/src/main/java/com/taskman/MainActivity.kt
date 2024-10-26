package com.taskman
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.provider.Settings
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {


    override fun getMainComponentName(): String {
        return "taskman"
    }
     override fun onCreate(savedInstanceState: Bundle?) {
     super.onCreate(savedInstanceState)

     if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R && !Environment.isExternalStorageManager()) {
       val intent = 
   Intent(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION)
       val uri = Uri.fromParts("package", packageName, null)
       intent.data = uri
       startActivity(intent)
     }
   }
    override fun createReactActivityDelegate(): ReactActivityDelegate {
        return DefaultReactActivityDelegate(this, mainComponentName)
    }
}

