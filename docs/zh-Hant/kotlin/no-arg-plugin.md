[//]: # (title: 無參數編譯器外掛程式)

*no-arg* 編譯器外掛程式會為帶有特定註解的類別產生一個額外的零參數建構函式。

這個產生的建構函式是合成的，因此無法直接從 Java 或 Kotlin 呼叫，但可以使用反射來呼叫。

這使得 Java Persistence API (JPA) 能夠實例化一個類別，即使從 Kotlin 或 Java 的觀點來看，該類別沒有零參數建構函式 (請參閱下方關於 `kotlin-jpa` 外掛程式的說明)。

## 在您的 Kotlin 檔案中

新增註解以標記需要零參數建構函式的程式碼：

```kotlin
package com.my

annotation class Annotation
```

## Gradle

使用 Gradle 的外掛程式 DSL 新增此外掛程式：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("plugin.noarg") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id "org.jetbrains.kotlin.plugin.noarg" version "%kotlinVersion%"
}
```

</tab>
</tabs>

然後指定必須為帶註解的類別產生 no-arg 建構函式的 no-arg 註解列表：

```groovy
noArg {
    annotation("com.my.Annotation")
}
```

如果您希望此外掛程式從合成建構函式執行初始化邏輯，請啟用 `invokeInitializers` 選項。預設情況下，它是停用的。

```groovy
noArg {
    invokeInitializers = true
}
```

## Maven

```xml
<plugin>
    <artifactId>kotlin-maven-plugin</artifactId>
    <groupId>org.jetbrains.kotlin</groupId>
    <version>${kotlin.version}</version>

    <configuration>
        <compilerPlugins>
            <!-- 或 "jpa" 用於 JPA 支援 -->
            <plugin>no-arg</plugin>
        </compilerPlugins>

        <pluginOptions>
            <option>no-arg:annotation=com.my.Annotation</option>
            <!-- 在合成建構函式中呼叫實例初始化器 -->
            <!-- <option>no-arg:invokeInitializers=true</option> -->
        </pluginOptions>
    </configuration>

    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-noarg</artifactId>
            <version>${kotlin.version}</version>
        </dependency>
    </dependencies>
</plugin>
```

## JPA 支援

如同 `kotlin-spring` 外掛程式包裝在 `all-open` 之上，`kotlin-jpa` 則包裝在 `no-arg` 之上。此外掛程式會自動指定 [`@Entity`](https://docs.oracle.com/javaee/7/api/javax/persistence/Entity.html)、[`@Embeddable`](https://docs.oracle.com/javaee/7/api/javax/persistence/Embeddable.html) 和 [`@MappedSuperclass`](https://docs.oracle.com/javaee/7/api/javax/persistence/MappedSuperclass.html) *no-arg* 註解。

使用 Gradle 的外掛程式 DSL 新增此外掛程式：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("plugin.jpa") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id "org.jetbrains.kotlin.plugin.jpa" version "%kotlinVersion%"
}
```

</tab>
</tabs>

在 Maven 中，啟用 `jpa` 外掛程式：

```xml
<compilerPlugins>
    <plugin>jpa</plugin>
</compilerPlugins>
```

## 命令列編譯器

將外掛程式 JAR 檔案新增至編譯器外掛程式類別路徑，並指定註解或預設集：

```bash
-Xplugin=$KOTLIN_HOME/lib/noarg-compiler-plugin.jar
-P plugin:org.jetbrains.kotlin.noarg:annotation=com.my.Annotation
-P plugin:org.jetbrains.kotlin.noarg:preset=jpa