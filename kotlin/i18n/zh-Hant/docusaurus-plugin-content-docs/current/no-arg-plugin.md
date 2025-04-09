---
title: "無參數編譯器外掛 (No-arg compiler plugin)"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

*no-arg* 編譯器外掛程式會為具有特定註解的類別產生額外的零引數建構函式（zero-argument constructor）。

產生的建構函式是合成的（synthetic），因此無法直接從 Java 或 Kotlin 呼叫，但可以使用反射（reflection）呼叫。

這允許 Java 持久化 API (Java Persistence API, JPA) 實例化一個類別，即使它從 Kotlin 或 Java 的角度來看沒有零參數建構函式（請參閱[下方](#jpa-support) `kotlin-jpa` 外掛程式的描述）。

## 在您的 Kotlin 檔案中

新增註解以標記需要零引數建構函式的程式碼：

```kotlin
package com.my

annotation class Annotation
```

## Gradle

使用 Gradle 的外掛程式 DSL 新增此外掛程式：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("plugin.noarg") version "2.1.20"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id "org.jetbrains.kotlin.plugin.noarg" version "2.1.20"
}
```

</TabItem>
</Tabs>

然後指定 no-arg 註解的清單，這些註解必須導致為帶註解的類別產生 no-arg 建構函式：

```groovy
noArg {
    annotation("com.my.Annotation")
}
```

如果您希望外掛程式從合成建構函式執行初始化邏輯，請啟用 `invokeInitializers` 選項。 預設情況下，此選項已停用。

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
            <!-- Or "jpa" for JPA support -->
<plugin>no-arg</plugin>
        </compilerPlugins>
<pluginOptions>
            <option>no-arg:annotation=com.my.Annotation</option>
            <!-- Call instance initializers in the synthetic constructor -->
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

與包裝在 `all-open` 之上的 `kotlin-spring` 外掛程式一樣，`kotlin-jpa` 包裝在 `no-arg` 之上。 此外掛程式會自動指定 [`@Entity`](https://docs.oracle.com/javaee/7/api/javax/persistence/Entity.html)、[`@Embeddable`](https://docs.oracle.com/javaee/7/api/javax/persistence/Embeddable.html) 和 [`@MappedSuperclass`](https://docs.oracle.com/javaee/7/api/javax/persistence/MappedSuperclass.html) *no-arg* 註解。

使用 Gradle 外掛程式 DSL 新增此外掛程式：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("plugin.jpa") version "2.1.20"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id "org.jetbrains.kotlin.plugin.jpa" version "2.1.20"
}
```

</TabItem>
</Tabs>

在 Maven 中，啟用 `jpa` 外掛程式：

```xml
<compilerPlugins>
<plugin>jpa</plugin>
</compilerPlugins>
```

## Command-line compiler (命令列編譯器)

將外掛程式 JAR 檔案新增至編譯器外掛程式類別路徑，並指定註解或預設值：

```bash
-Xplugin=$KOTLIN_HOME/lib/noarg-compiler-plugin.jar
-P plugin:org.jetbrains.kotlin.noarg:annotation=com.my.Annotation
-P plugin:org.jetbrains.kotlin.noarg:preset=jpa
```