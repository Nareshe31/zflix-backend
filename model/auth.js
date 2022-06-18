const db = require('../connection.js');
let model={}

model.getUser=async(email)=>{
    let userModel=await db.getUserCollection()
    let movietvModel=await db.getMovieTvCollection()
    let user=await userModel.findOne({email}).populate("watchlist.data")
    if(user){
        return user
    }
    return null
}

model.addLastLogin=async(id)=>{
    let userModel=await db.getUserCollection()
    let user=await userModel.findByIdAndUpdate(id,{lastLogin:(new Date())},{new:true})
    if(user){
        return user
    }
    return null
}

model.addLastUsed=async(id)=>{
    let userModel=await db.getUserCollection()
    let user=await userModel.findByIdAndUpdate(id,{lastUsed:(new Date())},{new:true})
    if(user){
        return user
    }
    return null
}

model.createUser=async(userObj)=>{
    let userModel=await db.getUserCollection()
    let user=await userModel.insertMany([userObj])
    if(user[0]){
        return user[0]
    }
    return null
}

model.verifyUser=async(id)=>{
    let userModel=await db.getUserCollection()
    let users=await userModel.findByIdAndUpdate(id,{verified:true},{new:true})
    if(users){
        return users
    }
    else{
        return null
    }
}

model.searchUser=async(name)=>{
    let pattern=new RegExp(name)
    let userModel=await db.getUserCollection()
    let users=await userModel.find({name:{$regex:pattern,$options:'i'}},{name:1,email:1})
    if(users){
        return users
    }
    else{
        return null
    }
}

model.addToWatchlist=async(data)=>{
    let userModel=await db.getUserCollection()
    let movietvModel=await db.getMovieTvCollection()
    let movietv=await movietvModel.find({id:data.watchlist.id})
    if (!movietv.length) {
        let movietvRes=await movietvModel.insertMany([data.watchlist])
        let user=await userModel.findByIdAndUpdate(data.id,{$push:{watchlist:{data:movietvRes[0]._id} }},{new:true}).populate("watchlist.data")
        if (user) {
            return user
        } else {
            return null
        }
    }
    else{
        let user=await userModel.findByIdAndUpdate(data.id,{$push:{watchlist:{data:movietv[0]._id} }},{new:true}).populate("watchlist.data")
        if (user) {
            return user
        } else {
            return null
        }
    }
    
}

model.removeFromWatchlist=async(data)=>{
    let userModel=await db.getUserCollection()
    let movietvModel=await db.getMovieTvCollection()
    let user=await userModel.findByIdAndUpdate(data.id,{$pull:{watchlist:{_id:data.watchlistId}}},{new:true}).populate("watchlist.data")
    if (user) {
        return user
    } else {
        return null
    }
}

model.removeMultipleFromWatchlist=async(data)=>{
    let userModel=await db.getUserCollection()
    let movietvModel=await db.getMovieTvCollection()
    let user=await userModel.findByIdAndUpdate(data.id,{$pull:{watchlist:{_id: {$in:data.watchlistIds} }}},{new:true}).populate("watchlist.data")
    if (user) {
        return user
    } else {
        return null
    }
}

model.addToSearch=async(data)=>{
    let userModel=await db.getUserCollection()
    let user=await userModel.findByIdAndUpdate(data.id,{$push:{search:data.search}},{new:true})
    if (user) {
        return user
    } else {
        return null
    }
}

model.addToRecentMovie=async(data,key)=>{
    let userModel=await db.getUserCollection()
    let movietvModel=await db.getMovieTvCollection()
    let movietv=await movietvModel.find({id:data.movie.id})
    let user;
    if (!movietv.length) {
        let movietvRes=await movietvModel.insertMany([data.movie])
        let user=await userModel.findByIdAndUpdate(data.id,{$push:{[key]:{movie:movietvRes[0]._id} }},{new:true}).populate("watchlist.data recently_searched_movie.movie")
        if (user) {
            return user
        } else {
            return null
        }
    }
    else{
        let user=await userModel.findByIdAndUpdate(data.id,{$push:{[key]:{movie:movietv[0]._id} }},{new:true}).populate("watchlist.data recently_searched_movie.movie")
        console.log(user.recently_watched_movie);
        if (user) {
            return user
        } else {
            return null
        }
    }

}

//List
model.createList=async(data)=>{
    let userModel=await db.getUserCollection()
    let movietvModel=await db.getMovieTvCollection()
    let listModel=await db.getListCollection()

    // let movietv=await movietvModel.find({id:data.item.id})
    let res=await listModel.insertMany([data])
    // if (!movietv.length) {
    //     let movietvRes=await movietvModel.insertMany([data.watchlist])
    //     let user=await userModel.findByIdAndUpdate(data.id,{$push:{watchlist:{data:movietvRes[0]._id} }},{new:true}).populate("watchlist.data")
    //     if (user) {
    //         return user
    //     } else {
    //         return null
    //     }
    // }
    // else{
    //     let user=await userModel.findByIdAndUpdate(data.id,{$push:{watchlist:{data:movietv[0]._id} }},{new:true}).populate("watchlist.data")
    //     if (user) {
    //         return user
    //     } else {
    //         return null
    //     }
    // }
    if (res) {
        return res
    } else {
        return null
    }
    
}

model.addToList=async(data)=>{
    let userModel=await db.getUserCollection()
    let movietvModel=await db.getMovieTvCollection()
    let listModel=await db.getListCollection()

    let movietv=await movietvModel.find({id:data.item.id})
    if (!movietv.length) {
        let movietvRes=await movietvModel.insertMany([data.item])
        let user=await listModel.findByIdAndUpdate(data.id,{$push:{items:{item:movietvRes[0]._id} }},{new:true}).populate("items.item")
        if (user) {
            return user
        } else {
            return null
        }
    }
    else{
        let user=await listModel.findByIdAndUpdate(data.id,{$push:{items:{item:movietv[0]._id} }},{new:true}).populate("items.item")
        if (user) {
            return user
        } else {
            return null
        }
    }
    
}

model.getList=async(id)=>{
    let userModel=await db.getUserCollection()
    let movietvModel=await db.getMovieTvCollection()
    let listModel=await db.getListCollection()
    let list=await listModel.findById(id).populate("items.item")
    if (list) {
        return list
    } else {
        return null
    }
}

model.getAllLists=async()=>{
    let userModel=await db.getUserCollection()
    let movietvModel=await db.getMovieTvCollection()
    let listModel=await db.getListCollection()
    let list=await listModel.find()
    if (list) {
        return list
    } else {
        return null
    }
}

model.getAppInfo=async()=>{
    let appModel=await db.getAppInfoCollection()
    let info=await appModel.find({}) 
    if (info) {
        return info
    } else {
        return null
    }
}

module.exports=model