---
title: "Kotlin 與 OSGi"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

若要在您的 Kotlin 專案中啟用 Kotlin [OSGi](https://www.osgi.org/) 支援，請包含 `kotlin-osgi-bundle`，而不是常規的 Kotlin 函式庫。建議移除 `kotlin-runtime`、`kotlin-stdlib` 和 `kotlin-reflect` 依賴項，因為 `kotlin-osgi-bundle` 已經包含所有這些依賴項。您還應該注意是否包含外部 Kotlin 函式庫。大多數常規 Kotlin 依賴項不適用於 OSGi，因此您不應使用它們，而應將它們從您的專案中移除。

## Maven

若要將 Kotlin OSGi 捆綁包（bundle）包含到 Maven 專案中：

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-osgi-bundle</artifactId>
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

若要從外部函式庫中排除標準函式庫（請注意，「星號排除」僅在 Maven 3 中有效）：

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

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
dependencies {
    implementation(kotlin("osgi-bundle"))
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
dependencies {
    implementation "org.jetbrains.kotlin:kotlin-osgi-bundle:2.1.20"
}
```

</TabItem>
</Tabs>

若要排除作為傳遞依賴項的預設 Kotlin 函式庫，您可以使用以下方法：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
dependencies {
    implementation("some.group.id:some.library:someversion") {
        exclude(group = "org.jetbrains.kotlin")
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
dependencies {
    implementation('some.group.id:some.library:someversion') {
        exclude group: 'org.jetbrains.kotlin'
    }
}
```

</TabItem>
</Tabs>

## FAQ

### 為什麼不直接將所需的 manifest 選項添加到所有 Kotlin 函式庫中

即使這是提供 OSGi 支援的最佳方式，但不幸的是，目前還無法做到，因為所謂的
[「套件分割」問題](https://docs.osgi.org/specification/osgi.core/7.0.0/framework.module.html#d0e5999) 無法輕易消除，並且目前沒有計劃進行如此大的變更。 存在 `Require-Bundle` 功能，但它也不是最佳選擇，不建議使用。 因此，決定為 OSGi 建立一個單獨的工件（artifact）。