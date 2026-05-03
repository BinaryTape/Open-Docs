[//]: # (title: kapt から KSP への移行)
[//]: # (description: Kotlin プロジェクトでアノテーションプロセッサを kapt から KSP に移行する方法を学びます。)

このガイドでは、Kotlin の機能を最大限に活用し、ビルドパフォーマンスを向上させるために、アノテーションプロセッサを [kapt](kapt.md) から [KSP](ksp-overview.md) に移行する方法を学びます。

[kapt](kapt.md) (Kotlin Annotation Processing Tool) は、Java のアノテーションプロセッサを Kotlin で使用できるようにする便利なツールです。これは Kotlin のソースコードを Java の「スタブ」に変換し、そのスタブに対してアノテーションプロセッサを実行することで動作します。しかし、このプロセスは負荷が高く、ビルド時間を大幅に増加させるだけでなく、変換の過程で Kotlin 固有の一部の機能が失われてしまいます。

対照的に、[KSP](ksp-overview.md) (Kotlin Symbol Processing) は、Kotlin 専用に設計された kapt の代替手段です。KSP はすべての Kotlin 機能を理解し、ソースコードを直接解析するため、ビルド時間を短縮できます。

開始する前に、プロジェクトで使用しているプロセッサが KSP をサポートしているか確認してください。[サポートされているライブラリのリスト](ksp-overview.md#supported-libraries)を参照するか、各ライブラリのドキュメントを確認してください。

> KSP と kapt は並行して実行できるため、ライブラリやモジュールごとに段階的にプロジェクトを移行できます。
> 
{style="note"}

## プロジェクトに KSP プラグインを追加する

プロジェクトレベルの `build.gradle(.kts)` ファイルの `plugins {}` ブロックに KSP を追加します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("com.google.devtools.ksp") version "%kspVersion%" apply false 
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'com.google.devtools.ksp' version '%kspVersion%' apply false 
}
```

</tab>
</tabs>

> KSP の最新バージョンを確認するには、GitHub の [Releases](https://github.com/google/ksp/releases) を確認してください。
> 
{style="tip"}

## プロセッサを更新する

移行したいプロセッサを使用しているモジュールを見つけます。そのモジュールの `build.gradle(.kts)` ファイルで以下のように行います。

1. `plugins {}` ブロックに KSP を追加します。

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    plugins {
        id("com.google.devtools.ksp")
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    plugins {
        id 'com.google.devtools.ksp'
    }
    ```

    </tab>
    </tabs>
   
2. `dependencies {}` ブロックで、`kapt` を `ksp` に置き換えます。

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    dependencies {
        implementation("com.google.dagger:dagger:2.48")
        // kapt("com.google.dagger:dagger-compiler:2.48")
        
        // KSP プロセッサの依存関係:
        ksp("com.google.dagger:dagger-compiler:2.48") 
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy"> 

    ```groovy
    dependencies {
        implementation 'com.google.dagger:dagger:2.48'
        // kapt 'com.google.dagger:dagger-compiler:2.48'
        
        // KSP プロセッサの依存関係:
        ksp 'com.google.dagger:dagger-compiler:2.48'
    }
    ```

    </tab>
    </tabs>
    

> ほとんどのライブラリでは、この置き換えだけで十分です。追加の変更が必要かどうかについては、各ライブラリのドキュメントを確認してください。
> 
{style="note"}

## kapt プラグインを削除する

すべてのプロセッサを KSP に移行した後、すべてのビルドファイルから kapt プラグインを安全に削除できます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
   // この行を削除:
    id("org.jetbrains.kotlin.kapt")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    // この行を削除:
    id 'org.jetbrains.kotlin.kapt'
}
```

</tab>
</tabs>

残っている kapt の設定があれば削除してください。

## 次のステップ

* [KSP の開始方法](ksp-quickstart.md#create-your-own-processor)で、独自の KSP ベースのアノテーションプロセッサを作成する方法を学びます。
* [KSP リポジトリ](https://github.com/google/ksp/tree/main/examples)で、KSP を使用したプロジェクトの例を探索します。
* [概要](ksp-overview.md)で KSP の詳細を確認してください。