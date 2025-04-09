---
title: Koin構成の検証
---
Koinを使用すると、設定モジュールを検証して、実行時の依存性注入の問題を発見することを回避できます。

## Verify()を使用したKoin構成チェック - JVMのみ [3.3]

Koin Moduleでverify()拡張関数を使用します。それだけです！内部的には、これはすべてのコンストラクタクラスを検証し、Koin構成と相互チェックして、この依存関係に対してコンポーネントが宣言されているかどうかを確認します。失敗した場合、関数はMissingKoinDefinitionExceptionをスローします。

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

ご覧のとおり、Koin構成で使用されているが、直接宣言されていない型をリストするために、追加のTypesパラメータを使用しています。 これは、インジェクションされたパラメータとして使用されるSavedStateHandleおよびWorkerParameters型の場合です。 Contextは、開始時にandroidContext()関数によって宣言されます。

verify() APIは非常に軽量で、構成で実行するためにモック/スタブは必要ありません。

## インジェクションされたパラメータを使用した検証 - JVMのみ [4.0]

`parametersOf`を使用してインジェクションされたオブジェクトを伴う構成がある場合、構成にパラメータの型の定義がないため、検証は失敗します。
ただし、指定された定義`definition<Type>(Class1::class, Class2::class ...)`でインジェクションされるパラメータ型を定義できます。

その方法は次のとおりです。

```kotlin
class ModuleCheck {

    // インジェクションされた定義を持つ定義が与えられた場合
    val module = module {
        single { (a: Simple.ComponentA) -> Simple.ComponentB(a) }
    }

    @Test
    fun checkKoinModule() {
        
        // 検証し、インジェクションされたパラメータを宣言する
        module.verify(
            injections = injectedParameters(
                definition<Simple.ComponentB>(Simple.ComponentA::class)
            )
        )
    }
}
```

## タイプホワイトリスト

タイプを「ホワイトリスト」として追加できます。 これは、この型が定義に対してシステムに存在すると見なされることを意味します。 その方法は次のとおりです。

```kotlin
class NiaAppModuleCheck {

    @Test
    fun checkKoinModule() {

        // Verify Koin configuration
        niaAppModule.verify(
            // 定義で使用されているが、直接宣言されていない型をリストする（パラメータインジェクションなど）
            extraTypes = listOf(MyType::class ...)
        )
    }
}
```