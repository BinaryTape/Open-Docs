[//]: # (title: 新增 Android 相依性)

將 Android 特定相依性新增至 Kotlin 多平台模組的工作流程，與純 Android 專案相同：在您的 Gradle 檔案中宣告相依性並匯入專案。之後，您就可以在 Kotlin 程式碼中使用此相依性。

我們建議在 Kotlin 多平台專案中，透過將 Android 相依性新增到特定的 Android 源集來宣告它們。為此，請更新您專案 `shared` 目錄中的 `build.gradle(.kts)` 檔案：

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

如果頂層相依性具有非平凡的配置名稱，將 Android 專案中的頂層相依性移至多平台專案中的特定源集可能會很困難。例如，要從 Android 專案的頂層移動 `debugImplementation` 相依性，您需要將實作相依性新增到名為 `androidDebug` 的源集。為了最大程度地減少處理此類遷移問題所需付出的努力，您可以將 `dependencies {}` 區塊新增到 `androidTarget {}` 區塊內：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

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

</TabItem>
<TabItem title="Groovy" group-key="groovy">

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

</TabItem>
</Tabs>

在此處宣告的相依性將與來自頂層區塊的相依性完全相同地處理，但以這種方式宣告它們還會在您的建置腳本中視覺化地分離 Android 相依性，並使其減少混淆。

將相依性放置在腳本末尾的獨立 `dependencies {}` 區塊中，以符合 Android 專案的慣用方式，也是受支援的。然而，我們強烈建議**不要**這樣做，因為在頂層區塊中配置包含 Android 相依性的建置腳本，並在每個源集中配置其他目標相依性，很可能會導致混淆。

## 接下來呢？

查閱其他關於在多平台專案中新增相依性的資源，並了解更多資訊：

*   [在官方 Android 文件中新增相依性](https://developer.android.com/studio/build/dependencies)
*   [新增多平台函式庫或其他多平台專案的相依性](multiplatform-add-dependencies.md)
*   [新增 iOS 相依性](multiplatform-ios-dependencies.md)