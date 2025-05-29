[//]: # (title: Kotlin 与 OSGi)

为了在您的 Kotlin 项目中启用 Kotlin [OSGi](https://www.osgi.org/) 支持，请包含 `kotlin-osgi-bundle` 而非常规 Kotlin 库。建议移除 `kotlin-runtime`、`kotlin-stdlib` 和 `kotlin-reflect` 依赖项，因为 `kotlin-osgi-bundle` 已包含所有这些依赖项。当包含外部 Kotlin 库时，您也应该注意。大多数常规 Kotlin 依赖项不兼容 OSGi，因此您不应使用它们，并应将它们从项目中移除。

## Maven

将 Kotlin OSGi bundle 包含到 Maven 项目中：

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

将 `kotlin-osgi-bundle` 包含到 Gradle 项目中：

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

要排除作为传递依赖项引入的默认 Kotlin 库，您可以使用以下方法：

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

### 为什么不直接将所需的 manifest 选项添加到所有 Kotlin 库中

尽管这是提供 OSGi 支持的最优选方式，但不幸的是，由于所谓的“[包分割问题](https://docs.osgi.org/specification/osgi.core/7.0.0/framework.module.html#d0e5999)”目前无法实现，该问题无法轻易消除，并且目前没有计划进行如此大的改变。存在 `Require-Bundle` 功能，但它也不是最佳选项，不建议使用。因此，决定为 OSGi 制作一个独立的 artifact。