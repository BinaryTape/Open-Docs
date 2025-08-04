[//]: # (title: no-arg コンパイラプラグイン)

`no-arg` コンパイラプラグインは、特定のアノテーションを持つクラスに対して追加の引数なしコンストラクタを生成します。

生成されたコンストラクタは合成（synthetic）であるため、JavaやKotlinから直接呼び出すことはできませんが、リフレクションを使用して呼び出すことは可能です。

これにより、Java Persistence API (JPA) は、KotlinやJavaの観点から引数なしコンストラクタを持っていなくてもクラスをインスタンス化できます（`kotlin-jpa` プラグインの説明を[以下](#jpa-support)参照）。

## Kotlinファイル内

引数なしコンストラクタが必要なコードをマークするために、新しいアノテーションを追加します。

```kotlin
package com.my

annotation class Annotation
```

## Gradle

Gradleのplugins DSLを使用してプラグインを追加します。

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

次に、アノテーションが付けられたクラスに対して no-arg コンストラクタの生成につながる必要がある no-arg アノテーションのリストを指定します。

```groovy
noArg {
    annotation("com.my.Annotation")
}
```

合成コンストラクタから初期化ロジックを実行させたい場合は、`invokeInitializers` オプションを有効にします。デフォルトでは無効になっています。

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

## JPAサポート

`all-open` の上にラップされた `kotlin-spring` プラグインと同様に、`no-arg` の上に `kotlin-jpa` がラップされています。このプラグインは、[`@Entity`](https://docs.oracle.com/javaee/7/api/javax/persistence/Entity.html)、[`@Embeddable`](https://docs.oracle.com/javaee/7/api/javax/persistence/Embeddable.html)、および [`@MappedSuperclass`](https://docs.oracle.com/javaee/7/api/javax/persistence/MappedSuperclass.html) の `no-arg` アノテーションを自動的に指定します。

Gradle plugins DSLを使用してプラグインを追加します。

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

Mavenでは、`jpa` プラグインを有効にします。

```xml
<compilerPlugins>
    <plugin>jpa</plugin>
</compilerPlugins>
```

## コマンドラインコンパイラ

プラグインのJARファイルをコンパイラプラグインのクラスパスに追加し、アノテーションまたはプリセットを指定します。

```bash
-Xplugin=$KOTLIN_HOME/lib/noarg-compiler-plugin.jar
-P plugin:org.jetbrains.kotlin.noarg:annotation=com.my.Annotation
-P plugin:org.jetbrains.kotlin.noarg:preset=jpa
```