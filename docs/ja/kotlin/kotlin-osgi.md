[//]: # (title: KotlinとOSGi)

KotlinプロジェクトでKotlinの[OSGi](https://www.osgi.org/)サポートを有効にするには、通常のKotlinライブラリの代わりに`kotlin-osgi-bundle`を含めてください。
`kotlin-osgi-bundle`は`kotlin-runtime`、`kotlin-stdlib`、`kotlin-reflect`のすべてを含んでいるため、これらの依存関係を削除することをお勧めします。
また、外部のKotlinライブラリを含める場合も注意が必要です。ほとんどの通常のKotlin依存関係はOSGi対応ではないため、それらを使用せず、プロジェクトから削除する必要があります。

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

## FAQ

### なぜ必要なマニフェストオプションをすべてのKotlinライブラリに追加しないのですか

OSGiサポートを提供する上で最も望ましい方法ではありますが、残念ながら、いわゆる「[パッケージ分割 (package split) の問題](https://docs.osgi.org/specification/osgi.core/7.0.0/framework.module.html#d0e5999)」は容易には解消できず、現時点ではそのような大きな変更は計画されていないため、今は実現できません。`Require-Bundle`機能もありますが、これも最善の選択肢ではなく、使用は推奨されません。そのため、OSGi用に別のアーティファクトを作成することが決定されました。