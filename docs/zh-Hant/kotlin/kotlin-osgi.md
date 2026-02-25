[//]: # (title: Kotlin 與 OSGi)

若要在您的 Kotlin 專案中啟用 Kotlin [OSGi](https://www.osgi.org/) 支援，請包含 `kotlin-osgi-bundle` 而非一般的 Kotlin 程式庫。建議移除 `kotlin-runtime`、`kotlin-stdlib` 與 `kotlin-reflect` 相依性，因為 `kotlin-osgi-bundle` 已包含所有這些內容。若包含外部 Kotlin 程式庫時也應注意。多數一般 Kotlin 相依性尚未支援 OSGi，因此您不應使用它們，並應將其從專案中移除。

## Maven

若要將 Kotlin OSGi bundle 包含到 Maven 專案中：

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-osgi-bundle</artifactId>
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

若要從外部程式庫排除標準程式庫（請注意「星號排除」僅在 Maven 3 中運作）：

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

若要將 `kotlin-osgi-bundle` 包含到 Gradle 專案中：

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

若要排除作為遞移相依性傳入的預設 Kotlin 程式庫，您可以使用以下方法：

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

## FAQ

### 為什麼不直接在所有 Kotlin 程式庫中加入必要的 manifest 選項

雖然這是提供 OSGi 支援的首選方式，但遺憾的是，由於所謂的 [「封裝分割」(package split) 問題](https://docs.osgi.org/specification/osgi.core/7.0.0/framework.module.html#d0e5999) 目前無法達成，且該問題難以輕易消除，目前暫無計畫進行如此重大的變更。雖然有 `Require-Bundle` 功能，但它也不是最佳選項且不建議使用。因此，決定為 OSGi 製作一個獨立的構件。