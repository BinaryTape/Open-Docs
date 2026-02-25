[//]: # (title: Kotlin 与 OSGi)

要在您的 Kotlin 项目中启用 Kotlin [OSGi](https://www.osgi.org/) 支持，请包含 `kotlin-osgi-bundle` 而不是常规的 Kotlin 库。建议移除 `kotlin-runtime`、`kotlin-stdlib` 和 `kotlin-reflect` 依赖项，因为 `kotlin-osgi-bundle` 已经包含了所有这些内容。在包含外部 Kotlin 库的情况下，您也应该予以注意。大多数常规 Kotlin 依赖项并未适配 OSGi，因此您不应使用它们，并应将它们从项目中移除。

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

要从外部库中排除标准库（请注意，“星号排除”仅在 Maven 3 中有效）：

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

要排除作为传递依赖项引入的默认 Kotlin 库，可以使用以下方法：

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

## 常见问题解答

### 为什么不直接向所有 Kotlin 库添加所需的清单选项

尽管这是提供 OSGi 支持的首选方式，但由于无法轻易消除的所谓[“软件包拆分”问题](https://docs.osgi.org/specification/osgi.core/7.0.0/framework.module.html#d0e5999)，遗憾的是目前无法做到这一点，且目前尚未计划进行如此重大的更改。虽然有 `Require-Bundle` 功能，但它也不是最佳选择，且不建议使用。因此，决定为 OSGi 创建一个单独的构件。