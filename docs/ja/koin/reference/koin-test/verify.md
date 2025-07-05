---
title: Koin設定の検証
---

Koinを使用すると、設定モジュールを検証し、実行時に依存性注入の問題が発覚するのを回避できます。

## Verify() を使用したKoin設定チェック - JVMのみ [3.3]

Koinモジュールで `verify()` 拡張関数を使用します。それだけです！内部的には、これによりすべてのコンストラクタクラスが検証され、Koin設定と照合して、この依存関係に対してコンポーネントが宣言されているかどうかを確認します。失敗した場合、関数は `MissingKoinDefinitionException` をスローします。

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

        // Verify Koin configuration
        niaAppModule.verify()
    }
}
```

JUnitテストを起動すれば完了です！ ✅

ご覧のとおり、Koin設定で使用されているが直接宣言されていない型（パラメータ注入のように）をリストするために、`extraTypes` パラメータを使用します。これは、注入されるパラメータとして使用される `SavedStateHandle` 型および `WorkerParameters` 型の場合に当てはまります。`Context` は起動時に `androidContext()` 関数によって宣言されます。

`verify()` APIは非常に軽量で実行でき、設定上で実行するためにいかなるモックやスタブも必要としません。

## 注入されたパラメータを使用した検証 - JVMのみ [4.0]

`parametersOf` を持つ注入されたオブジェクトを意味する設定がある場合、設定内にパラメータの型の定義がないため、検証は失敗します。
ただし、指定された定義 `definition<Type>(Class1::class, Class2::class ...)` で注入されるようにパラメータ型を定義することができます。

以下にその方法を示します。

```kotlin
class ModuleCheck {

    // given a definition with an injected definition
    val module = module {
        single { (a: Simple.ComponentA) -> Simple.ComponentB(a) }
    }

    @Test
    fun checkKoinModule() {
        
        // Verify and declare Injected Parameters
        module.verify(
            injections = injectedParameters(
                definition<Simple.ComponentB>(Simple.ComponentA::class)
            )
        )
    }
}
```

## 型のホワイトリスト化

型を「ホワイトリスト」として追加できます。これは、その型が任意の定義に対してシステム内に存在すると見なされることを意味します。以下にその方法を示します。

```kotlin
class NiaAppModuleCheck {

    @Test
    fun checkKoinModule() {

        // Verify Koin configuration
        niaAppModule.verify(
            // List types used in definitions but not declared directly (like parameter injection)
            extraTypes = listOf(MyType::class ...)
        )
    }
}
```

## コアアノテーション - 安全な型を自動的に宣言する

また、Koinのメインプロジェクト（`koin-core-annotations` モジュール配下）に、Koinアノテーションから抽出されたアノテーションを導入しました。
これらは、`@InjectedParam` と `@Provided` を使用することで冗長な宣言を避け、Koinがインジェクションコントラクトを推論し、設定を検証するのに役立ちます。複雑なDSL設定を使用する代わりに、これによりこれらの要素を特定しやすくなります。
これらのアノテーションは、今のところ `verify` APIでのみ使用されます。

```kotlin
// indicates that "a" is an injected parameter
class ComponentB(@InjectedParam val a: ComponentA)
// indicates that "a" is dynamically provided
class ComponentBProvided(@Provided val a: ComponentA)
```

これにより、カスタム検証ロジックを記述することなく、テスト中または実行時に発生する微妙な問題を防止できます。