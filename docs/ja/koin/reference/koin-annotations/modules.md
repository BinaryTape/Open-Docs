---
title: \@Module付きモジュール
---

定義を利用する際、それらをモジュールに整理する必要がある場合とない場合があります。まったくモジュールを使わずに、生成された「デフォルト」モジュールを利用することもできます。

## モジュールなし - 生成されたデフォルトモジュールの利用

モジュールを指定したくない場合、Koinはすべての定義をホストするためのデフォルトのモジュールを提供します。`defaultModule` は直接使用できます。

```kotlin
// Use Koin Generation
import org.koin.ksp.generated.*

fun main() {
    startKoin {
        defaultModule()
    }
}

// or 

fun main() {
    startKoin {
        modules(
          defaultModule
        )
    }
}
```

:::info
  `org.koin.ksp.generated.*` のインポートを忘れないでください。
:::

## @Module を用いたクラスモジュール

モジュールを宣言するには、クラスに `@Module` アノテーションを付けるだけです。

```kotlin
@Module
class MyModule
```

Koinにモジュールをロードするには、`@Module` クラス用に生成された `.module` 拡張機能を使用するだけです。モジュールの新しいインスタンス `MyModule().module` を作成するだけで済みます。

```kotlin
// Use Koin Generation
import org.koin.ksp.generated.*

fun main() {
    startKoin {
        modules(
          MyModule().module
        )
    }
}
```

> `org.koin.ksp.generated.*` のインポートを忘れないでください。

## @ComponentScan を用いたコンポーネントスキャン

アノテーション付きコンポーネントをスキャンしてモジュールにまとめるには、モジュールに `@ComponentScan` アノテーションを使用するだけです。

```kotlin
@Module
@ComponentScan
class MyModule
```

これにより、現在のパッケージとそのサブパッケージをスキャンし、アノテーション付きコンポーネントを探します。特定のパッケージ (`@ComponentScan("com.my.package")`) をスキャンするように指定することもできます。

:::info
  `@ComponentScan` アノテーションを使用する場合、KSPは同じパッケージに対して全てのGradleモジュールを横断します。(1.4以降)
:::

## クラスモジュール内の定義

定義をクラスモジュール内に直接定義するには、関数を定義アノテーションでアノテーション付けすることができます。

```kotlin
// given 
// class MyComponent(val myDependency : MyDependency)

@Module
class MyModule {

  @Single
  fun myComponent(myDependency : MyDependency) = MyComponent(myDependency)
}
```

> `@InjectedParam`、`@Property` は関数メンバーでも使用可能です。

## モジュールの組み込み

他のクラスモジュールを自分のモジュールに含めるには、`@Module` アノテーションの `includes` 属性を使用するだけです。

```kotlin
@Module
class ModuleA

@Module(includes = [ModuleA::class])
class ModuleB
```

このようにして、ルートモジュールを実行するだけで済みます。

```kotlin
// Use Koin Generation
import org.koin.ksp.generated.*

fun main() {
    startKoin {
        modules(
          // will load ModuleB & ModuleA
          ModuleB().module
        )
    }
}