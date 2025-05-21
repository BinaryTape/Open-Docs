---
title: "Kotlin 和 OSGi"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

要在你的 Kotlin 项目中启用 Kotlin [OSGi](https://www.osgi.org/) 支持，请包含 `kotlin-osgi-bundle` 而不是常规的 Kotlin 库。建议移除 `kotlin-runtime`、`kotlin-stdlib` 和 `kotlin-reflect` 依赖，因为 `kotlin-osgi-bundle` 已经包含了所有这些。你还应该注意包含外部 Kotlin 库的情况。大多数常规 Kotlin 依赖不是 OSGi 就绪的，所以你不应该使用它们，并应该从你的项目中移除它们。

## Maven

要将 Kotlin OSGi 捆绑包包含到 Maven 项目中：

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-osgi-bundle</artifactId>
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

要从外部库中排除标准库（注意 "star exclusion" 仅在 Maven 3 中有效）：

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

要将 `kotlin-osgi-bundle` 包含到 Gradle 项目中：

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

要排除作为传递依赖项提供的默认 Kotlin 库，你可以使用以下方法：

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

### 为什么不直接将所需的 manifest 选项添加到所有 Kotlin 库

即使这是提供 OSGi 支持的首选方式，但不幸的是，由于所谓的
["package split" issue](https://docs.osgi.org/specification/osgi.core/7.0.0/framework.module.html#d0e5999) ，目前还无法实现，这个问题不容易消除，并且目前没有计划进行如此大的更改。虽然有 `Require-Bundle` 功能，但它也不是最佳选择，不建议使用。因此，决定为 OSGi 制作一个单独的 artifact。