[//]: # (title: Kotlin 与 OSGi)

要在你的 Kotlin 项目中启用 Kotlin [OSGi](https://www.osgi.org/) 支持，请引入 `kotlin-osgi-bundle` 而非常规的 Kotlin 库。建议移除 `kotlin-runtime`、`kotlin-stdlib` 和 `kotlin-reflect` 依赖项，因为 `kotlin-osgi-bundle` 已包含所有这些。当包含外部 Kotlin 库时，你也应留意。大多数常规 Kotlin 依赖项不支持 OSGi，因此你不应使用它们，并应将它们从项目中移除。

## Maven

将 Kotlin OSGi artifact 引入 Maven 项目：

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-osgi-bundle</artifactId>
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

从外部库中排除标准库（请注意，Maven 3 才支持“星号排除”）：

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

将 `kotlin-osgi-bundle` 引入 Gradle 项目：

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

要排除作为传递依赖项引入的默认 Kotlin 库，你可以使用以下方法：

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

## 常见问题

### 为什么不直接为所有 Kotlin 库添加所需的清单选项？

尽管这是提供 OSGi 支持最推荐的方式，但不幸的是，目前无法实现，因为所谓的 ["package split" 问题](https://docs.osgi.org/specification/osgi.core/7.0.0/framework.module.html#d0e5999) 不易消除，并且目前也未计划进行如此大的变更。虽然有 `Require-Bundle` 特性，但它也不是最佳选项，不建议使用。因此决定为 OSGi 单独创建一个 artifact。