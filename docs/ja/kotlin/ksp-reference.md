[//]: # (title: Java アノテーションプロセッシングから KSP へのリファレンス)

## プログラム要素 (Program elements)

| **Java** | **KSP における最も近い機能** | **備考** |
| -------- | --------------------------- | --------- |
| `AnnotationMirror` | `KSAnnotation` | |
| `AnnotationValue` | `KSValueArguments` | |
| `Element` | `KSDeclaration` / `KSDeclarationContainer` | |
| `ExecutableElement` | `KSFunctionDeclaration` | |
| `PackageElement` | `KSFile` | KSP はパッケージをプログラム要素としてモデル化しません |
| `Parameterizable` | `KSDeclaration` | |
| `QualifiedNameable` | `KSDeclaration` | |
| `TypeElement` | `KSClassDeclaration` | |
| `TypeParameterElement` | `KSTypeParameter` | |
| `VariableElement` | `KSValueParameter` / `KSPropertyDeclaration` | |

## 型 (Types)

KSP では明示的な型解決（type resolution）が必要なため、Java の一部の機能は `KSType` および解決前の対応する要素によってのみ実行できます。

| **Java** | **KSP における最も近い機能** | **備考** |
| -------- | --------------------------- | --------- |
| `ArrayType` | `KSBuiltIns.arrayType` | |
| `DeclaredType` | `KSType` / `KSClassifierReference` | |
| `ErrorType` | `KSType.isError` | |
| `ExecutableType` | `KSType` / `KSCallableReference` | |
| `IntersectionType` | `KSType` / `KSTypeParameter` | |
| `NoType` | `KSType.isError` | KSP では該当なし |
| `NullType` | | KSP では該当なし |
| `PrimitiveType` | `KSBuiltIns` | Java のプリミティブ型と厳密に同じではありません |
| `ReferenceType` | `KSTypeReference` | |
| `TypeMirror` | `KSType` | |
| `TypeVariable` | `KSTypeParameter` | |
| `UnionType` | N/A | Kotlin は catch ブロックごとに 1 つの型しか持ちません。`UnionType` は Java のアノテーションプロセッサからさえも観測できません |
| `WildcardType` | `KSType` / `KSTypeArgument` | |

## その他 (Misc)

| **Java** | **KSP における最も近い機能** | **備考** |
| -------- | --------------------------- | --------- |
| `Name` | `KSName` | |
| `ElementKind` | `ClassKind` / `FunctionKind` | |
| `Modifier` | `Modifier` | |
| `NestingKind` | `ClassKind` / `FunctionKind` | |
| `AnnotationValueVisitor` |  | |
| `ElementVisitor` | `KSVisitor` | |
| `AnnotatedConstruct` | `KSAnnotated` | |
| `TypeVisitor` |  | |
| `TypeKind` | `KSBuiltIns` | 一部は builtins にあります。それ以外は `DeclaredType` について `KSClassDeclaration` を確認してください |
| `ElementFilter` | `Collection.filterIsInstance` | |
| `ElementKindVisitor` | `KSVisitor` | |
| `ElementScanner` | `KSTopDownVisitor` | |
| `SimpleAnnotationValueVisitor` |  | KSP では不要です |
| `SimpleElementVisitor` | `KSVisitor` | |
| `SimpleTypeVisitor` |  | |
| `TypeKindVisitor` |  | |
| `Types` | `Resolver` / `utils` | `utils` の一部はシンボルインターフェースにも統合されています |
| `Elements` | `Resolver` / `utils` | |

## 詳細 (Details)

Java アノテーションプロセッシング API の機能が KSP でどのように実行されるかを確認してください。

### AnnotationMirror

| **Java** | **KSP における同等の機能** |
| -------- | ------------------ |
| `getAnnotationType` | `ksAnnotation.annotationType` |
| `getElementValues` | `ksAnnotation.arguments` |

### AnnotationValue

| **Java** | **KSP における同等の機能** |
| -------- | ------------------ |
| `getValue` | `ksValueArgument.value` |

### Element

| **Java** | **KSP における同等の機能** |
| -------- | ------------------ |
| `asType` | `ksClassDeclaration.asType(...)` は `KSClassDeclaration` でのみ利用可能です。型引数を指定する必要があります。 |
| `getAnnotation` | 実装予定 |
| `getAnnotationMirrors` | `ksDeclaration.annotations` |
| `getEnclosedElements` | `ksDeclarationContainer.declarations` |
| `getEnclosingElements` | `ksDeclaration.parentDeclaration` |
| `getKind` | `ClassKind` または `FunctionKind` に従った型チェックとキャスト |
| `getModifiers` | `ksDeclaration.modifiers` |
| `getSimpleName` | `ksDeclaration.simpleName` |

### ExecutableElement

| **Java** | **KSP における同等の機能** |
| -------- | ------------------ |
| `getDefaultValue` | 実装予定 |
| `getParameters` | `ksFunctionDeclaration.parameters` |
| `getReceiverType` | `ksFunctionDeclaration.parentDeclaration` |
| `getReturnType` | `ksFunctionDeclaration.returnType` |
| `getSimpleName` | `ksFunctionDeclaration.simpleName` |
| `getThrownTypes` | Kotlin では不要です |
| `getTypeParameters` | `ksFunctionDeclaration.typeParameters` |
| `isDefault` | 親の宣言がインターフェースかどうかを確認します |
| `isVarArgs` | `ksFunctionDeclaration.parameters.any { it.isVarArg }` |

### Parameterizable

| **Java** | **KSP における同等の機能** |
| -------- | ------------------ |
| `getTypeParameters` | `ksFunctionDeclaration.typeParameters` |

### QualifiedNameable

| **Java** | **KSP における同等の機能** |
| -------- | ------------------ |
| `getQualifiedName` | `ksDeclaration.qualifiedName` |

### TypeElement

<table>
    <tr>
        <td><b>Java</b></td>
        <td><b>KSP における同等の機能</b></td>
    </tr>
    <tr>
        <td><code>getEnclosedElements</code></td>
        <td><code>ksClassDeclaration.declarations</code></td>
    </tr>
    <tr>
        <td><code>getEnclosingElement</code></td>
        <td><code>ksClassDeclaration.parentDeclaration</code></td>
    </tr>
    <tr>
        <td><code>getInterfaces</code></td>
<td>

```kotlin
// 解決（resolution）なしで実行できるはずです
ksClassDeclaration.superTypes
    .map { it.resolve() }
    .filter { (it?.declaration as? KSClassDeclaration)?.classKind == ClassKind.INTERFACE }
```

</td>
    </tr>
    <tr>
        <td><code>getNestingKind</code></td>
        <td><code>KSClassDeclaration.parentDeclaration</code> と <code>inner</code> 修飾子を確認します</td>
    </tr>
    <tr>
        <td><code>getQualifiedName</code></td>
        <td><code>ksClassDeclaration.qualifiedName</code></td>
    </tr>
    <tr>
        <td><code>getSimpleName</code></td>
        <td><code>ksClassDeclaration.simpleName</code></td>
    </tr>
    <tr>
        <td><code>getSuperclass</code></td>
<td>

```kotlin
// 解決（resolution）なしで実行できるはずです
ksClassDeclaration.superTypes
    .map { it.resolve() }
    .filter { (it?.declaration as? KSClassDeclaration)?.classKind == ClassKind.CLASS }
```

</td>
    </tr>
    <tr>
        <td><code>getTypeParameters</code></td>
        <td><code>ksClassDeclaration.typeParameters</code></td>
    </tr>
</table>

### TypeParameterElement

| **Java** | **KSP における同等の機能** |
| -------- | ------------------ |
| `getBounds` | `ksTypeParameter.bounds` |
| `getEnclosingElement` | `ksTypeParameter.parentDeclaration` |
| `getGenericElement` | `ksTypeParameter.parentDeclaration` |

### VariableElement

| **Java** | **KSP における同等の機能** |
| -------- | ------------------ |
| `getConstantValue` | 実装予定 |
| `getEnclosingElement` | `ksValueParameter.parentDeclaration` |
| `getSimpleName` | `ksValueParameter.simpleName` |

### ArrayType

| **Java** | **KSP における同等の機能** |
| -------- | ------------------ |
| `getComponentType` | `ksType.arguments.first()` |

### DeclaredType

| **Java** | **KSP における同等の機能** |
| -------- | ------------------ |
| `asElement` | `ksType.declaration` |
| `getEnclosingType` | `ksType.declaration.parentDeclaration` |
| `getTypeArguments` | `ksType.arguments` |

### ExecutableType

> 関数の `KSType` は、`FunctionN<R, T1, T2, ..., TN>` ファミリによって表される単なるシグネチャです。
>
{style="note"}

| **Java** | **KSP における同等の機能** |
| -------- | ------------------ |
| `getParameterTypes` | `ksType.declaration.typeParameters`, `ksFunctionDeclaration.parameters.map { it.type }` |
| `getReceiverType` | `ksFunctionDeclaration.parentDeclaration.asType(...)` |
| `getReturnType` | `ksType.declaration.typeParameters.last()` |
| `getThrownTypes` | Kotlin では不要です |
| `getTypeVariables` | `ksFunctionDeclaration.typeParameters` |

### IntersectionType

| **Java** | **KSP における同等の機能** |
| -------- | ------------------ |
| `getBounds` | `ksTypeParameter.bounds` |

### TypeMirror

| **Java** | **KSP における同等の機能** |
| -------- | ------------------ |
| `getKind` | プリミティブ型や `Unit` 型については `KSBuiltIns` 内の型と比較し、それ以外は宣言された型と比較します |

### TypeVariable

| **Java** | **KSP における同等の機能** |
| -------- | ------------------ |
| `asElement` | `ksType.declaration` |
| `getLowerBound` | 検討中。キャプチャが提供され、明示的な境界チェックが必要な場合にのみ必要です。 |
| `getUpperBound` | `ksTypeParameter.bounds` |

### WildcardType

<table>
    <tr>
        <td><b>Java</b></td>
        <td><b>KSP における同等の機能</b></td>
    </tr>
    <tr>
        <td><code>getExtendsBound</code></td>
<td>

```kotlin
if (ksTypeArgument.variance == Variance.COVARIANT) ksTypeArgument.type else null
```

</td>
    </tr>
    <tr>
        <td><code>getSuperBound</code></td>
<td>

```kotlin
if (ksTypeArgument.variance == Variance.CONTRAVARIANT) ksTypeArgument.type else null
```

</td>
    </tr>
</table>

### Elements

<table>
    <tr>
        <td><b>Java</b></td>
        <td><b>KSP における同等の機能</b></td>
    </tr>
    <tr>
        <td><code>getAllAnnotationMirrors</code></td>
        <td><code>KSDeclarations.annotations</code></td>
    </tr>
    <tr>
        <td><code>getAllMembers</code></td>
        <td><code>getAllFunctions</code>、<code>getAllProperties</code> が実装予定です</td>
    </tr>
    <tr>
        <td><code>getBinaryName</code></td>
        <td>検討中。<a href="https://docs.oracle.com/javase/specs/jls/se13/html/jls-13.html#jls-13.1">Java 仕様</a>を参照してください</td>
    </tr>
    <tr>
        <td><code>getConstantExpression</code></td>
        <td>式ではなく定数値があります</td>
    </tr>
    <tr>
        <td><code>getDocComment</code></td>
        <td>実装予定</td>
    </tr>
    <tr>
        <td><code>getElementValuesWithDefaults</code></td>
        <td>実装予定</td>
    </tr>
    <tr>
        <td><code>getName</code></td>
        <td><code>resolver.getKSNameFromString</code></td>
    </tr>
    <tr>
        <td><code>getPackageElement</code></td>
        <td>パッケージはサポートされていませんが、パッケージ情報は取得できます。KSP ではパッケージに対する操作は不可能です</td>
    </tr>
    <tr>
        <td><code>getPackageOf</code></td>
        <td>パッケージはサポートされていません</td>
    </tr>
    <tr>
        <td><code>getTypeElement</code></td>
        <td><code>Resolver.getClassDeclarationByName</code></td>
    </tr>
    <tr>
        <td><code>hides</code></td>
        <td>実装予定</td>
    </tr>
    <tr>
        <td><code>isDeprecated</code></td>
<td>

```kotlin
KsDeclaration.annotations.any { 
    it.annotationType.resolve()!!.declaration.qualifiedName!!.asString() == Deprecated::class.qualifiedName
}
```

</td>
    </tr>
    <tr>
        <td><code>overrides</code></td>
        <td><code>KSFunctionDeclaration.overrides</code> / <code>KSPropertyDeclaration.overrides</code> （各クラスのメンバ関数）</td>
    </tr>
    <tr>
        <td><code>printElements</code></td>
        <td>KSP はほとんどのクラスで基本的な <code>toString()</code> 実装を持っています</td>
    </tr>
</table>

### 型の操作 (Types)
{id="type-operations"}

| **Java** | **KSP における同等の機能** |
| -------- | ------------------ |
| `asElement` | `ksType.declaration` |
| `asMemberOf` | `resolver.asMemberOf` |
| `boxedClass` | 不要です |
| `capture` | 検討中 |
| `contains` | `KSType.isAssignableFrom` |
| `directSuperTypes` | `(ksType.declaration as KSClassDeclaration).superTypes` |
| `erasure` | `ksType.starProjection()` |
| `getArrayType` | `ksBuiltIns.arrayType.replace(...)` |
| `getDeclaredType` | `ksClassDeclaration.asType` |
| `getNoType` | `ksBuiltIns.nothingType` / `null` |
| `getNullType` | コンテキストによっては `KSType.markNullable` が役立つ場合があります |
| `getPrimitiveType` | 不要です。`KSBuiltins` を確認してください |
| `getWildcardType` | `KSTypeArgument` を期待する場所で `Variance` を使用します |
| `isAssignable` | `ksType.isAssignableFrom` |
| `isSameType` | `ksType.equals` |
| `isSubsignature` | `functionTypeA == functionTypeB` / `functionTypeA == functionTypeB.starProjection()` |
| `isSubtype` | `ksType.isAssignableFrom` |
| `unboxedType` | 不要です |