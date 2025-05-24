---
title: KotlinとOSGi
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

KotlinプロジェクトでKotlinの [OSGi](https://www.osgi.org/) サポートを有効にするには、通常のKotlinライブラリの代わりに `kotlin-osgi-bundle` を含めます。`kotlin-runtime`、`kotlin-stdlib`、および `kotlin-reflect` の依存関係は、`kotlin-osgi-bundle` に既にすべて含まれているため、削除することをお勧めします。また、外部のKotlinライブラリが含まれている場合は注意が必要です。ほとんどの通常のKotlinの依存関係はOSGiに対応していないため、それらを使用すべきではなく、プロジェクトから削除する必要があります。

## Maven

Kotlin OSGiバンドルをMavenプロジェクトに含めるには：

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-osgi-bundle</artifactId>
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

外部ライブラリから標準ライブラリを除外するには（「スター除外」はMaven 3でのみ機能することに注意してください）：

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

`kotlin-osgi-bundle`をGradleプロジェクトに含めるには：

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

推移的な依存関係として提供されるデフォルトのKotlinライブラリを除外するには、次のアプローチを使用できます。

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

### すべてのKotlinライブラリに必要なマニフェストオプションを追加しないのはなぜですか？

OSGiサポートを提供するための最も好ましい方法ですが、残念ながら、いわゆる ["package split" issue](https://docs.osgi.org/specification/osgi.core/7.0.0/framework.module.html#d0e5999) があり、簡単には解消できず、そのような大きな変更は今のところ計画されていません。`Require-Bundle` 機能もありますが、これも最良のオプションではなく、使用することは推奨されていません。そのため、OSGi用に個別のアーティファクトを作成することにしました。