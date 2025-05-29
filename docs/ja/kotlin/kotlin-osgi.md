[//]: # (title: KotlinとOSGi)

KotlinプロジェクトでKotlinの[OSGi](https://www.osgi.org/)サポートを有効にするには、通常のKotlinライブラリの代わりに`kotlin-osgi-bundle`を含めます。`kotlin-osgi-bundle`にはすでにそれらすべてが含まれているため、`kotlin-runtime`、`kotlin-stdlib`、`kotlin-reflect`の依存関係は削除することをお勧めします。また、外部のKotlinライブラリが含まれている場合にも注意が必要です。ほとんどの通常のKotlin依存関係はOSGi対応ではないため、それらを使用せず、プロジェクトから削除する必要があります。

## Maven

MavenプロジェクトにKotlin OSGiバンドルを含めるには：

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

Gradleプロジェクトに`kotlin-osgi-bundle`を含めるには：

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

推移的依存関係として含まれるデフォルトのKotlinライブラリを除外するには、次のアプローチを使用できます：

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

## よくある質問

### なぜすべてのKotlinライブラリに必須のマニフェストオプションを追加しないのですか

OSGiサポートを提供する最も推奨される方法ではあるものの、残念ながら、いわゆる「[パッケージ分割](https://docs.osgi.org/specification/osgi.core/7.0.0/framework.module.html#d0e5999)」の問題が簡単には解消できず、現時点ではそのような大きな変更は計画されていないため、現状では実現できません。`Require-Bundle`機能もありますが、これも最良の選択肢ではなく、使用は推奨されていません。そのため、OSGi用に個別のアーティファクトを作成することが決定されました。