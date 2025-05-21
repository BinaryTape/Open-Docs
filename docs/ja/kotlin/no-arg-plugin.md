---
title: 引数なしコンパイラプラグイン
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

*no-arg* コンパイラープラグインは、特定のアノテーションを持つクラスに対して、追加の引数なしコンストラクターを生成します。

生成されたコンストラクターは synthetic であるため、Java や Kotlin から直接呼び出すことはできませんが、リフレクションを使用して呼び出すことができます。

これにより、Java Persistence API (JPA) は、Kotlin または Java の観点からは引数なしのコンストラクターを持たないクラスをインスタンス化できます (「kotlin-jpa」プラグインの説明を[下記](#jpa-support)参照)。

## Kotlin ファイル内

新しいアノテーションを追加して、引数なしのコンストラクターが必要なコードをマークします。

```kotlin
package com.my

annotation class Annotation
```

## Gradle

Gradle の plugins DSL を使用してプラグインを追加します。

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

次に、アノテーション付きクラスに対して引数なしコンストラクターを生成する必要がある no-arg アノテーションのリストを指定します。

```groovy
noArg {
    annotation("com.my.Annotation")
}
```

synthetic コンストラクターから初期化ロジックを実行する場合は、`invokeInitializers` オプションを有効にします。
デフォルトでは、無効になっています。

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

## JPA サポート

`all-open` の上にラップされた `kotlin-spring` プラグインと同様に、`kotlin-jpa` は `no-arg` の上にラップされています。このプラグインは、[`@Entity`](https://docs.oracle.com/javaee/7/api/javax/persistence/Entity.html)、[`@Embeddable`](https://docs.oracle.com/javaee/7/api/javax/persistence/Embeddable.html)、および [`@MappedSuperclass`](https://docs.oracle.com/javaee/7/api/javax/persistence/MappedSuperclass.html) *no-arg* アノテーションを自動的に指定します。

Gradle plugins DSL を使用してプラグインを追加します。

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

Maven では、`jpa` プラグインを有効にします。

```xml
<compilerPlugins>
<plugin>jpa</plugin>
</compilerPlugins>
```

## コマンドラインコンパイラー

プラグイン JAR ファイルをコンパイラープラグインのクラスパスに追加し、アノテーションまたはプリセットを指定します。

```bash
-Xplugin=$KOTLIN_HOME/lib/noarg-compiler-plugin.jar
-P plugin:org.jetbrains.kotlin.noarg:annotation=com.my.Annotation
-P plugin:org.jetbrains.kotlin.noarg:preset=jpa
```