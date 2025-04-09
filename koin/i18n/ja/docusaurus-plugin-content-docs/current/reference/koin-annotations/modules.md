---
title: "@Module を使用したモジュール"
---
定義を使用する際に、モジュールでそれらを整理する必要があるかどうかを検討する必要があります。モジュールを一切使用せずに、生成された「デフォルト」モジュールを使用することもできます。

## モジュールなし - 生成されたデフォルトモジュールの使用

モジュールを指定したくない場合、Koinはすべての定義をホストするためのデフォルトモジュールを提供します。 `defaultModule` はすぐに使用できます。

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
  `org.koin.ksp.generated.*` のimportを使用することを忘れないでください。
:::

## @Moduleによるクラスモジュール

モジュールを宣言するには、クラスに `@Module` アノテーションを付与します。

```kotlin
@Module
class MyModule
```

Koinにモジュールをロードするには、`@Module` クラスに対して生成された `.module` 拡張機能を使用します。モジュールの新しいインスタンス `MyModule().module` を作成するだけです。

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

> `org.koin.ksp.generated.*` のimportを使用することを忘れないでください。

## @ComponentScanによるコンポーネントスキャン

アノテーション付きコンポーネントをスキャンしてモジュールに収集するには、モジュールで `@ComponentScan` アノテーションを使用します。

```kotlin
@Module
@ComponentScan
class MyModule
```

これにより、現在（カレント）のパッケージとサブパッケージがアノテーション付きコンポーネントに対してスキャンされます。特定のパッケージをスキャンするように指定することもできます `@ComponentScan("com.my.package")`

:::info
  `@ComponentScan` アノテーションを使用すると、KSPは同じパッケージのすべてのGradleモジュールをトラバースします。（1.4以降）
:::

## クラスモジュールでの定義

定義を直接定義するには、定義アノテーションを使用して関数にアノテーションを付けることができます。

```kotlin
// given 
// class MyComponent(val myDependency : MyDependency)

@Module
class MyModule {

  @Single
  fun myComponent(myDependency : MyDependency) = MyComponent(myDependency)
}
```

> @InjectedParam、@Propertyも関数メンバーで使用できます。

## モジュールのインクルード (Including Modules)

他のクラスモジュールをモジュールにインクルードするには、`@Module` アノテーションの `includes` 属性を使用します。

```kotlin
@Module
class ModuleA

@Module(includes = [ModuleA::class])
class ModuleB
```

これにより、ルートモジュールを実行できます。

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
```