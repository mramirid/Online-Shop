# Online Shop

On progress

## Lib changes

Please modify the HasManyAddAssociationMixinOptions interface definition to avoid compilation error 

> File location: node_modules/sequelize/types/lib/associations/has-many.d.ts

```typescript
  /**
   * The options for the addAssociation mixin of the hasMany association.
   * @see HasManyAddAssociationMixin
   */
  export interface HasManyAddAssociationMixinOptions extends InstanceUpdateOptions<any> {
    through: any  // Added
  }
```

## How to run?

1. Create a MySQL database named 'online_shop'

2. Run npm install

```bash 
$ npm install
```

3. Compile the TypeScript sources

```bash 
$ tsc --watch
```

4. Run nodemon using my configuration

```bash 
$ npm start
```
