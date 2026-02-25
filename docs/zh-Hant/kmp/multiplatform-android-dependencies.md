[//]: # (title: 新增 Android 相依性)

為 Kotlin 多平台模組新增 Android 特定相依性的工作流程，與純 Android 專案相同：在 Gradle 檔案中宣告相依性並匯入專案。之後，您就可以在 Kotlin 程式碼中使用該相依性。

我們建議在 Kotlin 多平台專案中透過將 Android 相依性新增到特定的 Android 原始碼集來進行宣告。為此，請更新專案 `shared` 目錄中的 `build.gradle(.kts)` 檔案：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

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

</TabItem>
<TabItem title="Groovy" group-key="groovy">

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

</TabItem>
</Tabs>

將 Android 專案中的頂層相依性移動到多平台專案中的特定原始碼集時，如果該頂層相依性具有非平凡的配置名稱，可能會比較困難。例如，要從 Android 專案的頂層移動 `debugImplementation` 相依性，您將需要將實作相依性新增到名為 `androidDebug` 的原始碼集。為了盡量減少處理此類遷移問題所需的工作，您可以在 `android {}` 區塊內新增一個 `dependencies {}` 區塊：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    android {
        //...
        dependencies {
            implementation("com.example.android:app-magic:12.3")
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    android {
        //...
        dependencies {
            implementation 'com.example.android:app-magic:12.3'
        }
    }
}
```

</TabItem>
</Tabs>

這裡宣告的相依性將被視為與頂層區塊中的相依性完全相同，但以此方式宣告還能在組建指令碼中從視覺上區隔 Android 相依性，使其更不容易混淆。

也支援按照 Android 專案慣例，將相依性放在指令碼末端的獨立 `dependencies {}` 區塊中。但是，我們強烈建議**不要**這樣做，因為在頂層區塊中配置 Android 相依性，而在各個原始碼集中配置其他目標相依性，很可能會造成混淆。

## 下一步？

查看關於在多平台專案中新增相依性的其他資源，並進一步了解：

* [Android 官方文件中的新增相依性](https://developer.android.com/studio/build/dependencies)
* [新增多平台庫或其他多平台專案的相依性](multiplatform-add-dependencies.md)
* [新增 iOS 相依性](multiplatform-ios-dependencies.md)