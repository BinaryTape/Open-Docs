[//]: # (title: 無參數編譯器插件)

*無參數*編譯器插件會為具有特定註解的類別生成一個額外的零參數建構函式。

生成的建構函式是合成的 (synthetic)，因此無法直接從 Java 或 Kotlin 呼叫，但可以透過反射呼叫。

這允許 Java Persistence API (JPA) 在類別本身從 Kotlin 或 Java 的角度來看沒有零參數建構函式的情況下，仍能實例化該類別（詳情請參閱下方關於 `kotlin-jpa` 插件的描述：[JPA 支援](#jpa-support)）。

## 在您的 Kotlin 檔案中

新增註解以標記需要零參數建構函式的程式碼：

```kotlin
package com.my

annotation class Annotation
```

## Gradle

使用 Gradle 的插件 DSL 新增插件：

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

然後指定無參數註解的列表，這些註解必須導致為被註解的類別生成無參數建構函式：

```groovy
noArg {
    annotation("com.my.Annotation")
}
```

如果您希望插件從合成建構函式運行初始化邏輯，請啟用 `invokeInitializers` 選項。預設情況下，它是禁用的。

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
            <!-- 或針對 JPA 支援使用 "jpa" -->
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

如同建立在 `all-open` 之上的 `kotlin-spring` 插件，`kotlin-jpa` 也是建立在 `no-arg` 之上。該插件會自動指定 [`@Entity`](https://docs.oracle.com/javaee/7/api/javax/persistence/Entity.html)、[`@Embeddable`](https://docs.oracle.com/javaee/7/api/javax/persistence/Embeddable.html) 和 [`@MappedSuperclass`](https://docs.oracle.com/javaee/7/api/javax/persistence/MappedSuperclass.html) 無參數註解。

使用 Gradle 插件 DSL 新增插件：

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

在 Maven 中，啟用 `jpa` 插件：

```xml
<compilerPlugins>
    <plugin>jpa</plugin>
</compilerPlugins>
```

## 命令列編譯器

將插件 JAR 檔案新增至編譯器插件類別路徑，並指定註解或預設集：

```bash
-Xplugin=$KOTLIN_HOME/lib/noarg-compiler-plugin.jar
-P plugin:org.jetbrains.kotlin.noarg:annotation=com.my.Annotation
-P plugin:org.jetbrains.kotlin.noarg:preset=jpa