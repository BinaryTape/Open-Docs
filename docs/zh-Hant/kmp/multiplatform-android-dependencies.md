[//]: # (title: 新增 Android 相依性)

將 Android 特有相依性新增至 Kotlin Multiplatform 模組的工作流程，與純粹的 Android 專案相同：在 Gradle 檔案中宣告相依性並匯入專案。之後，您就可以在 Kotlin 程式碼中使用此相依性。

我們建議在 Kotlin Multiplatform 專案中，透過將 Android 相依性新增到特定的 Android 原始碼集來宣告它們。為此，請更新專案 `shared` 目錄中的 `build.gradle(.kts)` 檔案：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        androidMain.dependencies {
            implementation("com.example.android:app-magic:12.3")
        }
    } 
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        androidMain {
            dependencies {
                implementation 'com.example.android:app-magic:12.3'
            }
        }
    }
}
```

</tab>
</tabs>

如果頂層相依性具有非簡單的組態名稱，將 Android 專案中的頂層相依性移動到多平台專案中的特定原始碼集可能會很困難。例如，要將 `debugImplementation` 相依性從 Android 專案的頂層移動，您需要將實作相依性新增到名為 `androidDebug` 的原始碼集。為了最大程度地減少處理此類遷移問題所需付出的努力，您可以在 `androidTarget {}` 區塊中新增一個 `dependencies {}` 區塊：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    androidTarget {
        //...
        dependencies {
            implementation("com.example.android:app-magic:12.3")
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    androidTarget {
        //...
        dependencies {
            implementation 'com.example.android:app-magic:12.3'
        }
    }
}
```

</tab>
</tabs>

在此宣告的相依性將與頂層區塊中的相依性完全相同，但以這種方式宣告它們也會在您的建置指令碼中視覺化地分離 Android 相依性，並減少混淆。

雖然也支援將相依性以 Android 專案慣用的方式放入指令碼末尾的獨立 `dependencies {}` 區塊中。但是，我們強烈**不建議**這樣做，因為在頂層區塊中設定 Android 相依性，而在每個原始碼集中設定其他目標相依性，很可能會造成混淆。

## 接下來是什麼？

查看有關在多平台專案中新增相依性的其他資源，並了解更多資訊：

*   [在官方 Android 文件中新增相依性](https://developer.android.com/studio/build/dependencies)
*   [新增多平台函式庫或其他多平台專案的相依性](multiplatform-add-dependencies.md)
*   [新增 iOS 相依性](multiplatform-ios-dependencies.md)