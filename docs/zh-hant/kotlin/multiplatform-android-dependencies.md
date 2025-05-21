---
title: "新增 Android 依賴項"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

將 Android 專用 (Android-specific) 的依賴項 (dependencies) 加入到 Kotlin Multiplatform 模組的工作流程，與純 Android 專案相同：在您的 Gradle 檔案中宣告依賴項，然後匯入專案。之後，您就可以在 Kotlin 程式碼中使用這個依賴項。

我們建議在 Kotlin Multiplatform 專案中宣告 Android 依賴項，方法是將它們新增到特定的 Android 源集 (source set)。為此，請更新專案 `shared` 目錄中的 `build.gradle(.kts)` 檔案：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
sourceSets {
    androidMain.dependencies {
        implementation("com.example.android:app-magic:12.3")
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
sourceSets {
    androidMain {
        dependencies {
            implementation 'com.example.android:app-magic:12.3'
        }
    }
}
```

</TabItem>
</Tabs>

如果頂層依賴項 (top-level dependency) 具有非簡單的組態名稱 (configuration name)，則將 Android 專案中頂層依賴項移動到多平台專案中的特定源集可能很困難。 例如，若要從 Android 專案的頂層移動 `debugImplementation` 依賴項，您需要將 implementation 依賴項新增到名為 `androidDebug` 的源集。 為了盡量減少您在處理此類遷移問題時所付出的努力，您可以在 `androidTarget {}` 區塊內新增 `dependencies {}` 區塊：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
androidTarget {
    //...
    dependencies {
        implementation("com.example.android:app-magic:12.3")
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
androidTarget {
    //...
    dependencies {
        implementation 'com.example.android:app-magic:12.3'
    }
}
```

</TabItem>
</Tabs>

在此處宣告的依賴項將被視為與頂層區塊中的依賴項完全相同，但是以這種方式宣告它們還可以在您的建置腳本中以視覺方式分隔 Android 依賴項，並減少混淆。

也支援將依賴項放入腳本末尾的獨立 `dependencies {}` 區塊中，這種方式符合 Android 專案的慣用風格。 但是，我們強烈**建議不要**這樣做，因為在頂層區塊中配置具有 Android 依賴項的建置腳本，以及在每個源集中配置其他目標依賴項，很可能會造成混淆。

## 接下來是什麼？

查看有關在多平台專案中新增依賴項的其他資源，並了解更多資訊：

* [在官方 Android 文件中新增依賴項](https://developer.android.com/studio/build/dependencies)
* [新增多平台函式庫或其他多平台專案的依賴項](multiplatform-add-dependencies)
* [新增 iOS 依賴項](multiplatform-ios-dependencies)