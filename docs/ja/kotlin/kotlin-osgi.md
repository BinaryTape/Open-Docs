[//]: # (title: Kotlin と OSGi)

Kotlinプロジェクトで[OSGi](https://www.osgi.org/)サポートを有効にするには、通常のKotlinライブラリの代わりに `kotlin-osgi-bundle` を含めます。`kotlin-osgi-bundle` にはこれらすべてがすでに含まれているため、`kotlin-runtime`、`kotlin-stdlib`、`kotlin-reflect` の依存関係を削除することをお勧めします。また、外部のKotlinライブラリが含まれている場合にも注意が必要です。ほとんどの通常のKotlin依存関係はOSGiに対応していないため、それらを使用すべきではなく、プロジェクトから削除する必要があります。

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

`kotlin-osgi-bundle` をGradleプロジェクトに含めるには：

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

推移的依存関係として提供されるデフォルトのKotlinライブラリを除外するには、次のアプローチを使用できます。

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

## FAQ

### なぜすべてのKotlinライブラリに必要なマニフェストオプションを追加しないのですか？

それがOSGiサポートを提供する最も好ましい方法ですが、残念ながら、簡単に解消できないいわゆる[「パッケージ分割（package split）」問題](https://docs.osgi.org/specification/osgi.core/7.0.0/framework.module.html#d0e5999)のため、現時点では不可能です。また、そのような大きな変更は今のところ計画されていません。`Require-Bundle` 機能がありますが、これも最良の選択肢ではなく、使用は推奨されません。そのため、OSGi用に別のアーティファクトを作成することが決定されました。