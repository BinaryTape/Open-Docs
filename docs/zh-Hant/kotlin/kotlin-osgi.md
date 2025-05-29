[//]: # (title: Kotlin 與 OSGi)

若要在您的 Kotlin 專案中啟用 Kotlin [OSGi](https://www.osgi.org/) 支援，請包含 `kotlin-osgi-bundle` 而非一般的 Kotlin 函式庫。建議移除 `kotlin-runtime`、`kotlin-stdlib` 和 `kotlin-reflect` 依賴項，因為 `kotlin-osgi-bundle` 已包含所有這些依賴項。您也應留意外部 Kotlin 函式庫被包含的情況。大部分一般的 Kotlin 依賴項尚未支援 OSGi，因此您不應使用它們，並應將它們從專案中移除。

## Maven

若要將 Kotlin OSGi 套件組合包含至 Maven 專案：

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-osgi-bundle</artifactId>
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

若要從外部函式庫中排除標準函式庫 (請注意，「星號排除 (star exclusion)」僅在 Maven 3 中有效)：

```xml
<dependency>
    <groupId>some.group.id</groupId>
    <artifactId>some.library</artifactId>
    <version>some.library.version</version>

    <exclusions>
        <exclusion>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>*</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

## Gradle

若要將 `kotlin-osgi-bundle` 包含至 Gradle 專案：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    implementation(kotlin("osgi-bundle"))
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    implementation "org.jetbrains.kotlin:kotlin-osgi-bundle:%kotlinVersion%"
}
```

</tab>
</tabs>

若要排除作為傳遞性依賴項的預設 Kotlin 函式庫，您可以使用以下方法：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    implementation("some.group.id:some.library:someversion") {
        exclude(group = "org.jetbrains.kotlin")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    implementation('some.group.id:some.library:someversion') {
        exclude group: 'org.jetbrains.kotlin'
    }
}
```

</tab>
</tabs>

## 常見問題

### 為何不直接將所需的 Manifest 選項新增至所有 Kotlin 函式庫？

儘管這是提供 OSGi 支援最推薦的方式，但遺憾的是，目前無法實現，因為所謂的「套件分割 (package split)」問題 [https://docs.osgi.org/specification/osgi.core/7.0.0/framework.module.html#d0e5999](https://docs.osgi.org/specification/osgi.core/7.0.0/framework.module.html#d0e5999) 無法輕易消除，且目前不打算進行如此大的變更。存在 `Require-Bundle` 功能，但這也不是最佳選擇，且不建議使用。因此決定為 OSGi 建立一個獨立的工件。