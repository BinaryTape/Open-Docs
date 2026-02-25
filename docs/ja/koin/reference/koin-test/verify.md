---
title: Koin 設定の検証
---

Koin では設定モジュールを検証することができ、実行時に依存関係注入（dependency injection）の問題が発見されるのを防ぐことができます。

## verify() による Koin 設定チェック - JVM 限定 [3.3]

Koin モジュールで `verify()` 拡張関数を使用します。これだけです！内部的には、これはすべてのコンストラクタクラスを検証し、Koin 設定と照合して、その依存関係に対して宣言されたコンポーネントがあるかどうかを確認します。失敗した場合、この関数は `MissingKoinDefinitionException` をスローします。

```kotlin
val niaAppModule = module {
    includes(
        jankStatsKoinModule,
        dataKoinModule,
        syncWorkerKoinModule,
        topicKoinModule,
        authorKoinModule,
        interestsKoinModule,
        settingsKoinModule,
        bookMarksKoinModule,
        forYouKoinModule
    )
    viewModelOf(::MainActivityViewModel)
}
```

```kotlin
class NiaAppModuleCheck {

    @Test
    fun checkKoinModule() {

        // Koin 設定を検証する
        niaAppModule.verify()
    }
}
```

JUnit テストを実行すれば完了です！ ✅

ご覧のように、Koin 設定で使用されているものの、直接宣言されていない型をリストするために `extraTypes` パラメータを使用する場合があります。これは、注入パラメータ（injected parameters）として使用される `SavedStateHandle` や `WorkerParameters` 型の場合に当てはまります。`Context` は開始時に `androidContext()` 関数によって宣言されます。

`verify()` API は動作が非常に軽量で、設定に対して実行するためにモックやスタブの類を一切必要としません。

## 注入パラメータを使用した検証 - JVM 限定 [4.0]

`parametersOf` を使用してオブジェクトを注入する設定がある場合、設定内にパラメータ型の定義がないため、検証は失敗します。
しかし、`definition<Type>(Class1::class, Class2::class ...)` を使用して、指定された定義で注入されるパラメータ型を定義できます。

手順は以下の通りです：

```kotlin
class ModuleCheck {

    // 注入された定義を持つ定義がある場合
    val module = module {
        single { (a: Simple.ComponentA) -> Simple.ComponentB(a) }
    }

    @Test
    fun checkKoinModule() {
        
        // 注入パラメータ（Injected Parameters）を検証および宣言する
        module.verify(
            injections = injectedParameters(
                definition<Simple.ComponentB>(Simple.ComponentA::class)
            )
        )
    }
}
```

## 型のホワイトリスト登録 (Type White-Listing)

型を「ホワイトリスト」として追加できます。これは、その型がいかなる定義に対してもシステム内に存在するものとみなされることを意味します。手順は以下の通りです：

```kotlin
class NiaAppModuleCheck {

    @Test
    fun checkKoinModule() {

        // Koin 設定を検証する
        niaAppModule.verify(
            // 定義で使用されているが直接宣言されていない型（パラメータ注入など）をリストアップする
            extraTypes = listOf(MyType::class ...)
        )
    }
}
```

## Core アノテーション - 安全な型を自動的に宣言する

また、Koin Annotations から抽出された、メインの Koin プロジェクト（`koin-core-annotations` モジュール内）のアノテーションも導入しました。
これらは、`@InjectedParam` や `@Provided` を使用することで冗長な宣言を回避し、Koin が注入コントラクト（injection contracts）を推論して設定を検証するのを助けます。複雑な DSL 設定を使用する代わりに、これらのアノテーションが要素の特定に役立ちます。
これらのアノテーションは、現在のところ `verify` API でのみ使用されます。

```kotlin
// "a" が注入パラメータであることを示す
class ComponentB(@InjectedParam val a: ComponentA)
// "a" が動的に提供されることを示す
class ComponentBProvided(@Provided val a: ComponentA)
```

これにより、カスタムの検証ロジックを記述することなく、テスト中や実行時の微妙な問題を防止できます。